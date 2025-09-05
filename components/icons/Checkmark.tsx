import type { SVGProps } from "react";
const Checkmark = (props: SVGProps<SVGSVGElement>) => (
	<svg
		fill="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M22.7278 4.88373C23.1378 5.29378 23.1378 5.9586 22.7278 6.36865L10.1267 18.9698C9.4855 19.611 8.4332 19.5672 7.84745 18.875L1.21459 11.3054C0.840011 10.8627 0.895221 10.2002 1.33791 9.82561C1.7806 9.45103 2.44312 9.50624 2.8177 9.94893L9.06445 17.0622L21.2429 4.88373C21.6529 4.47368 22.3177 4.47368 22.7278 4.88373Z"
		/>
	</svg>
);
export default Checkmark;
