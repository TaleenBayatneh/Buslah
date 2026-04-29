import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-paper-dim mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 bg-academic rounded-sm flex items-center justify-center">
              <span className="font-display text-primary-foreground text-lg font-bold leading-none -mt-1">م</span>
            </div>
            <span className="font-display text-xl font-bold text-academic">موجِّه</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            مرشدك الذكي لاختيار التخصص الجامعي المناسب في الأردن.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">روابط</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-academic">من نحن</Link></li>
            <li><Link to="/universities" className="hover:text-academic">دليل الجامعات</Link></li>
            <li><Link to="/chat" className="hover:text-academic">الشات بوت</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">للجامعات</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            هل أنت ممثل جامعة؟ سجّل حسابك لرفع بيانات التخصصات والقبول.
          </p>
          <Link to="/auth" className="inline-block mt-2 text-sm text-academic font-semibold hover:underline">
            سجّل كجامعة ←
          </Link>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} موجِّه. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}