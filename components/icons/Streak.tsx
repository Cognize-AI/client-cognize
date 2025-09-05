import type { SVGProps } from "react";
const Streak = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    viewBox="0 0 25 24"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.2259 5.46344L6.71906 12.5H11.9417C12.66 12.5 13.2174 13.1268 13.1335 13.8402L12.5719 18.6138L18.5995 11H12.8932C12.1714 11 11.6129 10.3673 11.7024 9.65112L12.2259 5.46344ZM12.4335 1.95309C13.1838 0.994285 14.7202 1.63336 14.5692 2.8415L13.7994 8.99996H20.2532C21.2566 8.99996 21.8168 10.1581 21.1941 10.9448L12.3885 22.0676C11.6378 23.0158 10.1146 22.3837 10.2559 21.1825L11.0421 14.5H5.07711C4.07687 14.5 3.51564 13.3481 4.1321 12.5604L12.4335 1.95309Z"
    />
  </svg>
);
export default Streak;
