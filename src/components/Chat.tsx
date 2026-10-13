import { useEffect, useState, type FormEvent } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/superbase';

type Conversation = {
  id: string;
  service_id: number;
  buyer_id: string;
  seller_id: string;
  created_at: string;
};

type ChatMessage = {
  id: number;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedServiceId = searchParams.get('servico');
  const requestedConversationId = searchParams.get('conversa');
  const [userId, setUserId] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [serviceTitles, setServiceTitles] = useState<Record<number, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeConversationId, setActiveConversationId] = useState('');
  const [ownServiceId, setOwnServiceId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadConversations() {
      setLoading(true);
      setNotice('');

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        if (active) {
          setNotice('Entre novamente para acessar suas conversas.');
          setLoading(false);
        }
        return;
      }

      const currentUserId = authData.user.id;
      let targetConversationId = requestedConversationId || '';
      setOwnServiceId(null);

      if (requestedServiceId) {
        const serviceId = Number(requestedServiceId);
        if (!Number.isSafeInteger(serviceId) || serviceId <= 0) {
          if (active) setNotice('O anúncio selecionado não é válido.');
        } else {
          const { data: service, error: serviceError } = await supabase
            .from('services')
            .select('id,title,user_id')
            .eq('id', serviceId)
            .maybeSingle();

          if (serviceError) {
            if (active) setNotice(`Não foi possível carregar o anúncio: ${serviceError.message}`);
          } else if (!service) {
            if (active) setNotice('Este anúncio não foi encontrado no banco de dados.');
          } else if (service.user_id === currentUserId) {
            if (active) setOwnServiceId(serviceId);
          } else if (service.user_id !== currentUserId) {
            const { data: existing, error: existingError } = await supabase
              .from('conversations')
              .select('id')
              .eq('service_id', serviceId)
              .eq('buyer_id', currentUserId)
              .eq('seller_id', service.user_id)
              .maybeSingle();

            if (existingError) {
              if (active) setNotice(`Não foi possível abrir o chat: ${existingError.message}`);
            } else if (existing) {
              targetConversationId = existing.id;
            } else {
              const { data: created, error: createError } = await supabase
                .from('conversations')
                .insert({
                  service_id: serviceId,
                  buyer_id: currentUserId,
                  seller_id: service.user_id,
                })
                .select('id')
                .single();

              if (createError) {
                if (createError.code === '23505') {
                  const { data: racedConversation } = await supabase
                    .from('conversations')
                    .select('id')
                    .eq('service_id', serviceId)
                    .eq('buyer_id', currentUserId)
                    .eq('seller_id', service.user_id)
                    .maybeSingle();
                  targetConversationId = racedConversation?.id || '';
                } else if (active) {
                  setNotice(`Não foi possível iniciar o chat: ${createError.message}`);
                }
              } else {
                targetConversationId = created.id;
              }
            }
          }
        }
      }

      const { data: conversationRows, error: conversationsError } = await supabase
        .from('conversations')
        .select('id,service_id,buyer_id,seller_id,created_at')
        .or(`buyer_id.eq.${currentUserId},seller_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (!active) return;
      if (conversationsError) {
        const missingConversationsTable = conversationsError.code === 'PGRST205'
          || conversationsError.message.includes("Could not find the table 'public.conversations'");
        setNotice(missingConversationsTable
          ? 'A tabela do chat ainda não está disponível no Supabase. Execute supabase/setup.sql no SQL Editor do projeto e recarregue esta página.'
          : `Não foi possível carregar as conversas: ${conversationsError.message}`);
        setLoading(false);
        return;
      }

      const rows = (conversationRows || []) as Conversation[];
      setUserId(currentUserId);
      setConversations(rows);

      if (rows.length) {
        const serviceIds = [...new Set(rows.map((conversation) => conversation.service_id))];
        const { data: services } = await supabase
          .from('services')
          .select('id,title')
          .in('id', serviceIds);
        if (active && services) {
          setServiceTitles(Object.fromEntries(services.map((service) => [service.id, service.title])));
        }
      }

      const selected = rows.find((conversation) => conversation.id === targetConversationId)
        || rows.find((conversation) => conversation.id === activeConversationId)
        || rows[0];
      setActiveConversationId(selected?.id || '');
      setLoading(false);
    }

    void loadConversations();
    return () => { active = false; };
  }, [requestedServiceId, requestedConversationId]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    let active = true;
    async function loadMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select('id,conversation_id,sender_id,content,created_at')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true });

      if (!active) return;
      if (error) {
        setNotice(`Não foi possível carregar as mensagens: ${error.message}`);
        return;
      }
      setMessages((data || []) as ChatMessage[]);
    }

    void loadMessages();
    const channel = supabase
      .channel(`chat-${activeConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const incoming = payload.new as ChatMessage;
          setMessages((current) => current.some((message) => message.id === incoming.id)
            ? current
            : [...current, incoming]);
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [activeConversationId]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = messageText.trim();
    if (!content || !activeConversationId || !userId || sending) return;

    setSending(true);
    setNotice('');
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversationId,
          sender_id: userId,
          content,
        })
        .select('id,conversation_id,sender_id,content,created_at')
        .single();

      if (error) throw error;
      setMessages((current) => current.some((message) => message.id === data.id)
        ? current
        : [...current, data as ChatMessage]);
      setMessageText('');
    } catch (error) {
      setNotice(error instanceof Error
        ? `Não foi possível enviar a mensagem: ${error.message}`
        : 'Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId);
  const contactName = searchParams.get('nome');
  const activeTitle = activeConversation
    ? serviceTitles[activeConversation.service_id] || `Anúncio #${activeConversation.service_id}`
    : 'Mensagens';

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header className="border-b border-slate-100 p-5">
        <h2 className="text-xl font-extrabold">Mensagens</h2>
        <p className="mt-1 text-sm text-slate-500">Converse com quem publicou ou demonstrou interesse nos anúncios.</p>
      </header>
      {notice && <p role="alert" className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">{notice}</p>}
      <div className="grid min-h-[460px] md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-slate-100 p-3 md:border-b-0 md:border-r">
          <p className="px-2 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">Conversas</p>
          {conversations.map((conversation) => {
            const isSelected = conversation.id === activeConversationId;
            const otherUserId = conversation.buyer_id === userId ? conversation.seller_id : conversation.buyer_id;
            const name = isSelected && contactName
              ? contactName
              : conversation.seller_id === userId ? 'Interessado no anúncio' : 'Profissional';
            return (
              <button
                key={conversation.id}
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  setSearchParams({ conversa: conversation.id });
                }}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl p-3 text-left ${isSelected ? 'bg-brand-50 text-brand-800' : 'text-slate-700 hover:bg-slate-50'}`}
                aria-label={`Abrir conversa com ${name}`}
                data-contact={otherUserId}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><MessageCircle size={18}/></span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{name}</span>
                  <span className="block truncate text-xs text-slate-500">{serviceTitles[conversation.service_id] || `Anúncio #${conversation.service_id}`}</span>
                </span>
              </button>
            );
          })}
          {!loading && conversations.length === 0 && (
            <p className="px-2 py-4 text-sm leading-6 text-slate-500">Suas conversas sobre anúncios aparecerão aqui.</p>
          )}
        </aside>
        <div className="flex min-h-[460px] min-w-0 flex-col">
          {activeConversation ? (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="font-bold">{contactName || (activeConversation.seller_id === userId ? 'Interessado no anúncio' : 'Profissional')}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{activeTitle}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4">
                {messages.map((message) => (
                  <div key={message.id} className={`max-w-[85%] rounded-2xl p-3 text-sm ${message.sender_id === userId ? 'ml-auto rounded-tr-sm bg-brand-500 text-white' : 'rounded-tl-sm border border-slate-200 bg-white text-slate-700'}`}>
                    {message.content}
                  </div>
                ))}
                {!messages.length && !loading && (
                  <p className="mx-auto max-w-xs rounded-xl bg-white px-3 py-2 text-center text-xs leading-5 text-slate-500">Esta conversa começou. Envie uma mensagem para combinar o atendimento.</p>
                )}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-3">
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500"
                  placeholder="Escreva sua mensagem..."
                  aria-label="Mensagem"
                />
                <button disabled={sending || !messageText.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label="Enviar mensagem">
                  <Send size={18}/>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center text-slate-500">
              <MessageCircle size={32} className="text-slate-300"/>
              <p className="mt-3 font-semibold">{loading ? 'Carregando conversas...' : 'Selecione uma conversa'}</p>
              {!loading && conversations.length === 0 && (
                <>
                  <p className="mt-2 max-w-sm text-sm leading-6">
                    {ownServiceId
                      ? 'Este anúncio pertence à sua conta. Para conversar, entre com outra conta e toque em “Falar com” neste anúncio.'
                      : 'Para iniciar um chat, abra o anúncio de outro profissional e toque em “Falar com”.'}
                  </p>
                  <Link to="/" className="mt-4 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white">Ver anúncios</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
