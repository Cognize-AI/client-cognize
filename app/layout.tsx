import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.scss";
import { TagsStoreProvider } from "@/provider/tags-store-provider";
import { UserStoreProvider } from "@/provider/user-store-provider";
import { CardStoreProvider } from "@/provider/card-store-provider";
import Script from "next/script";
import { ApiStoreProvider } from "@/provider/api-store-provider";

const interTight = Inter_Tight({
	variable: "--font-inter-tight",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Cognize – Simple AI-powered CRM",
	description:
		"Cognize is a simple, AI-powered CRM for startups, freelancers, and small teams. Organize contacts, manage leads, and qualify opportunities with smart tags and a clean, modern interface.",
	keywords: [
		"AI contact manager",
		"simple CRM tool",
		"lightweight CRM for startups",
		"lead management software",
		"AI-powered CRM platform",
		"contact organization tool",
		"CRM for freelancers",
		"CRM for solopreneurs",
		"affordable CRM for small business",
		"personal CRM for networking",
	],
	icons: {
		icon: "/favicon.svg",
	},
	openGraph: {
		title: "Cognize: To know and understand your contacts.",
		description:
			"Cognize is a simple, AI-powered CRM for startups, freelancers, and small teams.",
		url: "https://cognize.live",
		siteName: "Cognize",
		images: [
			{
				url: "https://cognize.live/og-image.png",
				width: 1200,
				height: 630,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Cognize – Simple AI-powered CRM",
		description:
			"Cognize is a simple, AI-powered CRM for startups, freelancers, and small teams.",
		images: ["https://client-cognize.vercel.app/og-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	if (typeof window !== "undefined") {
		console.log = () => {};
		console.warn = () => {};
		console.error = () => {};
	}
	return (
		<html lang="en">
			<head>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-QN94JBF45P"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QN94JBF45P');
          `}
				</Script>
			</head>
			<body className={`${interTight.variable}`}>
				<SpeedInsights />
				<UserStoreProvider>
					{/* <HeaderWrapper /> */}
					<ApiStoreProvider>
						<TagsStoreProvider>
							<CardStoreProvider>{children}</CardStoreProvider>
						</TagsStoreProvider>
					</ApiStoreProvider>
				</UserStoreProvider>
			</body>
		</html>
	);
}
