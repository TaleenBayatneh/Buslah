import { Link } from "@tanstack/react-router";
import { CompassLogo } from "@/components/CompassLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-paper-dim mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 font-serif">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 bg-gradient-compass rounded-full flex items-center justify-center shadow-compass">
              <CompassLogo className="size-6" animated={false} />
            </div>
            <span className="font-display text-xl font-bold text-gradient-compass font-serif">بوصلة</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-serif text-right">
            بوصلتك نحو التخصص الجامعي المناسب لطلاب التوجيهي في فلسطين.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">روابط</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-academic">من نحن</Link></li>
            <li><Link to="/universities" className="hover:text-academic">بوابة الجامعات</Link></li>
            <li><Link to="/chat" className="hover:text-academic">الشات بوت</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">للجامعات</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            هل أنت ممثل جامعة؟ اطّلع على بوابة الجامعات أو ارفع بيانات التخصصات بسهولة.
          </p>
          <Link to="/universities" className="inline-block mt-2 text-sm text-academic font-semibold hover:underline">
            بوابة الجامعات ←
          </Link>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} بوصلة · صُنع بـ ♥ لطلاب فلسطين. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}