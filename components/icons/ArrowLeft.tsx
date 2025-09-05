import type { SVGProps } from "react";
const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
	<svg
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		{...props}
	>
		<path
			d="M7.975 4.94165L2.91667 9.99998L7.975 15.0583"
			stroke="#194EFF"
			strokeWidth={1.5}
			strokeMiterlimit={10}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M17.0833 10H3.05833"
			stroke="#194EFF"
			strokeWidth={1.5}
			strokeMiterlimit={10}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export default ArrowLeft;
