import { Star } from 'lucide-react';

type RatingProps = {
  value: number;
  count: number;
};

export default function Rating({ value, count }: RatingProps) {
  if (!count) {
    return (
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Novo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold">
      <Star size={15} className="fill-rating text-rating" />
      {value.toFixed(1)}
      <span className="font-normal text-slate-400">({count})</span>
    </span>
  );
}
