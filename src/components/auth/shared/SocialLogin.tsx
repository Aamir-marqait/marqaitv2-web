export function SocialLogin() {
  return (
    <>
      <div className="flex items-center my-4 sm:my-5 mx-2 sm:mx-10 md:mx-22">
        <div className="grow h-px bg-[#6B7280]"></div>
        <span className="mx-2 text-sm md:text-[16px] font-normal leading-[100%] tracking-normal font-inter uppercase text-[#6B7280]">
          OR
        </span>
        <div className="grow h-px bg-[#6B7280]"></div>
      </div>
      <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 mb-3 md:mb-4">
        {/* Facebook */}
        <button className="cursor-pointer border rounded-full p-2 sm:p-2.5 md:p-3 shadow hover:bg-blue-50 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
              fill="#1877F2"
            />
          </svg>
        </button>
        {/* Google */}
        <button className="cursor-pointer border rounded-full p-2 sm:p-2.5 md:p-3 shadow hover:bg-red-50 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </button>
        {/* X/Twitter */}
        <button className="cursor-pointer border rounded-full p-2 sm:p-2.5 md:p-3 shadow hover:bg-gray-100 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="#000000"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
