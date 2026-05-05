import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-compass">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "بوصلة — مرشدك الذكي لاختيار التخصص الجامعي في فلسطين" },
      { name: "description", content: "بوصلة: شات بوت ذكي يساعد طلاب التوجيهي في فلسطين على اختيار التخصص الجامعي المناسب وفق المعدل، الميزانية، والموقع الجغرافي." },
      { property: "og:title", content: "بوصلة — مرشدك الذكي لاختيار التخصص الجامعي في فلسطين" },
      { property: "og:description", content: "اختر تخصصك الجامعي بثقة. بوصلة — مرشد ذكي مبني على بيانات حقيقية للجامعات الفلسطينية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    const arabicIndic = /[\u0660-\u0669]/g;
    const extArabicIndic = /[\u06F0-\u06F9]/g;

    const mapArabicIndic = (ch: string) => String.fromCharCode(48 + (ch.charCodeAt(0) & 0xf));

    function replaceInTextNode(node: Text) {
      let text = node.nodeValue || "";
      if (arabicIndic.test(text) || extArabicIndic.test(text)) {
        text = text.replace(arabicIndic, (m) => mapArabicIndic(m));
        text = text.replace(extArabicIndic, (m) => mapArabicIndic(m));
        node.nodeValue = text;
      }
    }

    function walk(root: Node) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      let n: Text | null = walker.nextNode() as Text | null;
      while (n) {
        replaceInTextNode(n);
        n = walker.nextNode() as Text | null;
      }
    }

    // initial pass
    walk(document.body);

    // also replace attributes like placeholders and values
    function replaceAttrs(root: ParentNode) {
      const inputs = root.querySelectorAll('input, textarea, [placeholder], [value]');
      inputs.forEach((el) => {
        try {
          const e = el as HTMLElement & { value?: string };
          if (e.getAttribute) {
            const attrs = ['placeholder', 'value', 'title', 'alt'];
            attrs.forEach((a) => {
              const v = e.getAttribute(a);
              if (v && (arabicIndic.test(v) || extArabicIndic.test(v))) {
                let nv = v.replace(arabicIndic, (m) => mapArabicIndic(m));
                nv = nv.replace(extArabicIndic, (m) => mapArabicIndic(m));
                e.setAttribute(a, nv);
              }
            });
          }
        } catch (err) {
          /* ignore */
        }
      });
    }

    replaceAttrs(document);

    // Observe DOM changes (for chat messages etc.)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) replaceInTextNode(node as Text);
            else if (node.nodeType === Node.ELEMENT_NODE) {
              walk(node);
              replaceAttrs(node as ParentNode);
            }
          });
        } else if (m.type === 'characterData' && m.target) {
          replaceInTextNode(m.target as Text);
        }
      }
    });

    mo.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => mo.disconnect();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  );
}
