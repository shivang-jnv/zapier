'use client'
import { useRouter } from "next/navigation"
import PrimaryButton from "./buttons/PrimaryButton"
import SecondaryButton from "./buttons/SecondaryButton"
import { Features } from "./Features"

export const Hero = () => {
  const router = useRouter();
  return <div>
    <div className="flex justify-center">
      <div className="text-5xl font-semibold text-center pt-8 max-w-xl">
        Automate as fast as you can type
      </div>
    </div>
    <div className="flex justify-center pt-4">
      <div className="text-xl font-normal text-center pt-8 max-w-3xl">
        AI gives you automation superpowers, and Zapier puts them to work. Pairing AI and Zapier helps you turn ideas into workflows and bots that work for you.
      </div>
    </div>

    <div className="flex flex-row justify-center pt-4">
      <PrimaryButton onClick={() => {
        router.push("/signup")
      }} size="big">Get started free</PrimaryButton>
      <div className="px-4"></div>
      <SecondaryButton onClick={() => {}} size="big">Contact Sales</SecondaryButton>
    </div>

    <div className="flex justify-center pt-4">
      <Features title={"Free forever"} subtitle={"for core features"} />
      <Features title={"More apps"} subtitle={"than any other platform"} />
      <Features title={"Cutting edge"} subtitle={"AI features"} />
    </div>
  </div>
}