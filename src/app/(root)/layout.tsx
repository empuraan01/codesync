import StreamVidProvider from "@/components/providers/StreamClientProvider";

function layout({children}: {children: React.ReactNode}) {
  return (
    <StreamVidProvider>
        {children}
    </StreamVidProvider>
  )
}

export default layout
