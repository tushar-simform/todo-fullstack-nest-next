import Image from "next/image";
import { APP_NAME } from "@/constants";
import mark from "@/assets/logo-mark.png";
import wordmark from "@/assets/logo-wordmark.png";
import wordmarkDark from "@/assets/logo-wordmark-dark.png";

/**
 * Brand logo. Phones get the compact mark (saves room for the nav); `sm` and
 * up get the full wordmark. The wordmark's dark ink would vanish on the dark
 * theme, so there is a light-ink variant swapped in by the theme (`dark:`).
 */
export function Logo() {
  return (
    <span className="flex items-center">
      <Image src={mark} alt={APP_NAME} priority className="h-10 w-auto sm:hidden" />
      <Image src={wordmark} alt={APP_NAME} priority className="hidden h-11 w-auto sm:block dark:sm:hidden" />
      <Image src={wordmarkDark} alt="" priority aria-hidden="true" className="hidden h-11 w-auto dark:sm:block" />
    </span>
  );
}
