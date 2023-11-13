import { useState, useEffect } from "react"
import formats from "../fetchData/formats"

const FormatPage: React.FC<{
	updateFormat: (state: string) => void
	currentFormat: string
	setIsFormatPageVisible: any
}> = ({ updateFormat, currentFormat, setIsFormatPageVisible }) => {
	const [formatsToDisplay, setFormatsToDisplay] = useState<React.ReactNode>([])

	useEffect(() => {
		generateFormats()
	}, [])

	const generateFormats = () => {
		const allFormats = formats?.map((format, i) => (
			<button
				className={`border-solid border-cyan-500 border-2 rounded-3xl px-10 py-5 hover:text-black hover:bg-cyan-500 transition ${
					currentFormat === format && "bg-cyan-500 text-black"
				}`}
				onClick={() => {
					updateFormat(format)
					setIsFormatPageVisible(false)
				}}
				key={i}>
				{format}
			</button>
		))

		setFormatsToDisplay(allFormats)
	}

	return (
		<div className='absolute top-0 left-0 right-0 min-h-screen flex flex-col items-center gap-12 bg-black p-12'>
			<h2 className='text-5xl font-bold'>Choose format</h2>
			<div className='mx-auto my-0 w-full max-w-[1440px] flex flex-wrap justify-center items-center gap-6 text-2xl text-center cursor-pointer font-bold'>
				{formatsToDisplay}
			</div>
		</div>
	)
}

export default FormatPage
