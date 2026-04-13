import { Star, User, Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="card-interactive rounded-2xl p-6 h-full flex flex-col relative group">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quote icon */}
      <Quote size={24} className="text-blue-500/15 mb-3 transition-colors duration-300 group-hover:text-blue-500/30" />

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < testimonial.rating ? 'text-amber-400' : 'text-faint'}
            fill={i < testimonial.rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-body text-sm leading-relaxed mb-6 flex-1">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-themed">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-themed flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue-500/10">
          <User size={18} className="text-muted" />
        </div>
        <div>
          <p className="text-sm font-semibold text-heading">{testimonial.name}</p>
          <p className="text-xs text-faint">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
