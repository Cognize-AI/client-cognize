import type { SVGProps } from "react";
const Add = (props: SVGProps<SVGSVGElement>) => (
	<svg
		fill="currentColor"
		viewBox="0 0 16 17"
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		{...props}
	>
		<path
			d="M4 8.5H12"
			stroke="#194EFF"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M8 12.5V4.5"
			stroke="#194EFF"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export default Add;
