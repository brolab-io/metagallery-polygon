"use client";
/* eslint-disable @next/next/no-head-element */
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "../common/configs/web3Config";
import "../common/plugins/axios.plugin";
import Footer from "../common/components/Footer";
import Navbar from "../common/components/Navbar";
import Web3Provider from "../common/components/Web3Provider";
import AuthContext from "../common/components/AuthContext";
import { ToastContainer } from "../common/components/ToastContainer";
import queryClient from "../common/configs/query.client";
import { QueryClientProvider } from "../common/components/QueryClientProvider";

export default function RootLayout({ children }: { children: any }) {
  return (
    <html>
      <head></head>

      <body>
        <AuthContext>
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <main className="py-[108px] bg-[#0C1226] min-h-screen">
              <>{children}</>
            </main>
            <Footer />
            <Web3Provider />
            <ToastContainer />
          </QueryClientProvider>
        </AuthContext>
      </body>
    </html>
  );
}
