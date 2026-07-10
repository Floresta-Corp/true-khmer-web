import type { IconProps } from "~/types"

export const CheckList = ({ size = 24, className }: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			className={className}
			aria-hidden="true"
			viewBox="0 0 45 46"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clipPath="url(#clip0_500_3541)">
				<path
					d="M15.8706 7.87994H11.2184C9.16289 7.87994 7.49658 9.54625 7.49658 11.6017V37.6543C7.49658 39.7099 9.16289 41.3761 11.2184 41.3761H22.3838"
					stroke="currentColor"
					strokeWidth="2.79135"
					strokeLinecap="round"
				/>
				<path
					d="M28.8965 7.87994H33.5487C35.6043 7.87994 37.2705 9.54625 37.2705 11.6017V28.3498"
					stroke="currentColor"
					strokeWidth="2.79135"
					strokeLinecap="round"
				/>
				<path
					d="M14.9397 12.3461V8.81039C14.9397 8.29652 15.3563 7.87994 15.8701 7.87994C16.384 7.87994 16.8085 7.46317 16.8965 6.9569C17.1722 5.37091 18.2409 2.29724 22.3833 2.29724C26.5257 2.29724 27.5944 5.37091 27.8702 6.9569C27.9582 7.46317 28.3826 7.87994 28.8964 7.87994C29.4102 7.87994 29.8269 8.29652 29.8269 8.81039V12.3461C29.8269 12.9627 29.3271 13.4626 28.7104 13.4626H16.0562C15.4396 13.4626 14.9397 12.9627 14.9397 12.3461Z"
					stroke="currentColor"
					strokeWidth="2.79135"
					strokeLinecap="round"
				/>
				<path
					d="M28.8965 38.5848L32.6183 42.3066L41.9228 33.0021"
					stroke="currentColor"
					strokeWidth="2.79135"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_500_3541">
					<rect
						width="44.6616"
						height="44.6616"
						fill="currentColor"
						transform="translate(0.0527344 0.436035)"
					/>
				</clipPath>
			</defs>
		</svg>
	)
}
