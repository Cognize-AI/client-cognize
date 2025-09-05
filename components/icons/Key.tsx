import type { SVGProps } from "react";
const Key = (props: SVGProps<SVGSVGElement>) => (
	<svg
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		{...props}
	>
		<path
			d="M16.4917 12.4416C14.775 14.1499 12.3167 14.6749 10.1584 13.9999L6.23337 17.9166C5.95004 18.2083 5.39171 18.3833 4.99171 18.3249L3.17504 18.0749C2.57504 17.9916 2.01671 17.4249 1.92504 16.8249L1.67504 15.0083C1.61671 14.6083 1.80837 14.0499 2.08337 13.7666L6.00004 9.84994C5.33337 7.68327 5.85004 5.22494 7.56671 3.5166C10.025 1.05827 14.0167 1.05827 16.4834 3.5166C18.95 5.97494 18.95 9.98327 16.4917 12.4416Z"
			stroke="#3D3D3D"
			strokeWidth={1.5}
			strokeMiterlimit={10}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M5.7417 14.5752L7.65837 16.4919"
			stroke="#3D3D3D"
			strokeWidth={1.5}
			strokeMiterlimit={10}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M12.0834 9.1665C12.7737 9.1665 13.3334 8.60686 13.3334 7.9165C13.3334 7.22615 12.7737 6.6665 12.0834 6.6665C11.393 6.6665 10.8334 7.22615 10.8334 7.9165C10.8334 8.60686 11.393 9.1665 12.0834 9.1665Z"
			stroke="#3D3D3D"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export default Key;
