import React from 'react'

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ size = 40, className = '', ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Stroke Linear Gradient */}
        <linearGradient
          id="paint0_linear_0_108"
          x1="13.9532"
          y1="0.5"
          x2="113.579"
          y2="100.126"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FC580F" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FC580F" stopOpacity="0.2" />
        </linearGradient>

        <linearGradient
          id="paint1_linear_0_108"
          x1="20.728"
          y1="7.27484"
          x2="106.805"
          y2="93.352"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27272A" />
          <stop offset="1" stopColor="#09090B" />
        </linearGradient>

        <linearGradient
          id="paint2_linear_0_108"
          x1="20.728"
          y1="7.27484"
          x2="106.805"
          y2="93.352"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FC580F" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FC580F" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient
          id="paint3_linear_0_108"
          x1="28"
          y1="14.5482"
          x2="99.5289"
          y2="86.0771"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FC580F" />
          <stop offset="1" stopColor="#D94E0C" />
        </linearGradient>

        <linearGradient
          id="paint4_linear_0_108"
          x1="28"
          y1="14.5482"
          x2="99.5289"
          y2="86.0771"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8246" />
          <stop offset="1" stopColor="#FC580F" />
        </linearGradient>

        {/* Filters */}
        <filter
          id="filter0_dddd_0_108"
          x="12.728"
          y="3.27484"
          x2="102.077"
          y2="102.077"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
        </filter>

        <filter
          id="filter1_ddddd_0_108"
          x="20"
          y="10.5482"
          x2="87.5289"
          y2="94.5289"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
        </filter>

        <filter
          id="filter2_i_0_108"
          x="39.1722"
          y="30.1298"
          width="49.5376"
          height="40.4888"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
        </filter>
      </defs>

      <g id="Group 2147225046">
        <rect
          id="Rectangle 161125285"
          x="13.9532"
          y="0.5"
          width="99.6255"
          height="99.6255"
          rx="23.5"
          fill="#171717"
          fillOpacity="0.3"
          stroke="url(#paint0_linear_0_108)"
        />
        <g id="Rectangle 161125284" filter="url(#filter0_dddd_0_108)">
          <rect
            x="20.728"
            y="7.27484"
            width="86.0772"
            height="86.0772"
            rx="20"
            fill="#D9D9D9"
          />
          <rect
            x="20.728"
            y="7.27484"
            width="86.0772"
            height="86.0772"
            rx="20"
            fill="url(#paint1_linear_0_108)"
          />
          <rect
            x="21.0311"
            y="7.57793"
            width="85.471"
            height="85.471"
            rx="19.6969"
            stroke="url(#paint2_linear_0_108)"
            strokeWidth="0.606177"
          />
        </g>
        <g id="Rectangle 161125283" filter="url(#filter1_ddddd_0_108)">
          <rect
            x="28"
            y="14.5482"
            width="71.5289"
            height="71.5289"
            rx="12"
            fill="#D9D9D9"
          />
          <rect
            x="28"
            y="14.5482"
            width="71.5289"
            height="71.5289"
            rx="12"
            fill="url(#paint3_linear_0_108)"
          />
          <rect
            x="28.5"
            y="15.0482"
            width="70.5289"
            height="70.5289"
            rx="11.5"
            stroke="url(#paint4_linear_0_108)"
          />
        </g>
        <g id="Union" filter="url(#filter2_i_0_108)">
          <path
            d="M72.7576 30.1298C73.2681 30.1298 73.5318 30.7398 73.1821 31.1116L57.0944 48.2171C56.4501 48.9022 56.9358 50.0258 57.8762 50.0258H69.7653C69.9259 50.0258 70.0793 50.0923 70.1894 50.2093L88.4608 69.6367C88.8105 70.0085 88.5471 70.6184 88.0367 70.6185H73.4966C73.336 70.6184 73.1825 70.5523 73.0724 70.4353L54.8006 51.0075C54.7559 50.96 54.7212 50.9086 54.6957 50.855C54.6584 50.7766 54.573 50.7226 54.4862 50.7226H39.9464C39.4359 50.7225 39.1722 50.1126 39.5219 49.7408L57.7933 30.3134C57.9034 30.1963 58.0571 30.1299 58.2178 30.1298H72.7576Z"
            fill="#FFFFFF"
          />
        </g>
      </g>
    </svg>
  )
}
