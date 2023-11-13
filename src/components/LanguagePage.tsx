import languages from "../fetchData/languages"
import { useState, useEffect } from "react"

const LanguagePage: React.FC<{
	updateLanguage: (state: string) => void
	currentLanguage: string
	setIsLanguagePageVisible: any
}> = ({ updateLanguage, currentLanguage, setIsLanguagePageVisible }) => {
	const [languagesToDisplay, setLanguagesToDisplay] = useState<React.ReactNode>(
		[]
	)

	useEffect(() => {
		generateLanguages()
	}, [])

	const generateLanguages = (searchedValue = "") => {
		let filteredLanguages
		if (searchedValue !== "") {
			filteredLanguages = languages?.filter(language =>
				language.languageName
					.toLowerCase()
					.includes(searchedValue.toLowerCase())
			)
		} else {
			filteredLanguages = [...languages]
		}

		const allLanguages = filteredLanguages?.map((language, i) => (
			<button
				className={`border-solid border-cyan-500 border-2 rounded-3xl px-10 py-5 hover:text-black hover:bg-cyan-500 transition ${
					currentLanguage === language.languageCode && "bg-cyan-500 text-black"
				}`}
				onClick={() => {
					updateLanguage(language.languageCode)
					setIsLanguagePageVisible(false)
				}}
				key={i}>
				{language.languageName}
			</button>
		))

		setLanguagesToDisplay(allLanguages)
	}

	const filterLanguages = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		generateLanguages(value)
	}

	return (
		<div className='absolute top-0 left-0 right-0 min-h-screen flex flex-col items-center gap-12 bg-black p-12'>
			<h2 className='text-5xl font-bold'>Choose language</h2>
			<input
				type='text'
				placeholder='Search language...'
				className='bg-black border-solid border-cyan-500 border-b-2 py-2 px-2 focus-visible:outline-none
				text-xl'
				onChange={filterLanguages}
			/>
			<div className='mx-auto my-0 w-full max-w-[1440px] flex flex-wrap justify-center items-center gap-6 text-2xl text-center cursor-pointer font-bold'>
				{languagesToDisplay}
			</div>
		</div>
	)
}

export default LanguagePage
