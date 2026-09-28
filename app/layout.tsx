import "./globals.css";
import "./modern-ui.css";
import "./document-reader.css";
import "./new-ticket-ui.css";
import "./dashboard-ui.css";
import "./readability-ui.css";
import "./compact-home.css";
import "./typography-system.css";
import AppNav from "./AppNav";
import SiteFooter from "./SiteFooter";

export const metadata={
  title:"Hệ thống hỗ trợ CNTT Vinatex Đà Nẵng",
  description:"Cổng hỗ trợ CNTT Vinatex Đà Nẵng"
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="vi"><body><AppNav/>{children}<SiteFooter/></body></html>;
}
