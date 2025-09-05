import type { SVGProps } from "react";
const Suitcase = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M6.24992 5.41683H3.74992C2.82944 5.41683 2.08325 6.16302 2.08325 7.0835V15.4168C2.08325 16.3373 2.82944 17.0835 3.74992 17.0835H16.2499C17.1704 17.0835 17.9166 16.3373 17.9166 15.4168V7.0835C17.9166 6.16302 17.1704 5.41683 16.2499 5.41683H13.7499M6.24992 5.41683V3.75016C6.24992 2.82969 6.99611 2.0835 7.91659 2.0835H12.0833C13.0037 2.0835 13.7499 2.82969 13.7499 3.75016V5.41683M6.24992 5.41683H13.7499"
      stroke="#3D3D3D"
      strokeLinejoin="round"
    />
  </svg>
);
export default Suitcase;
