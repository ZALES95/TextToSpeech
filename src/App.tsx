import { useState } from "react"
import axios from "axios"
import LanguagePage from "./components/LanguagePage"
import FormatPage from "./components/FormatPage"

function App() {
	const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
	const [audio, setAudio] = useState<string>("")
	const [errorMsg, setErrorMsg] = useState<string>("")
	const [isLanguagePageVisible, setIsLanguagePageVisible] =
		useState<boolean>(false)
	const [isFormatPageVisible, setIsFormatPageVisible] = useState<boolean>(false)

	const [settings, setSettings] = useState<{
		text: string
		language: string
		speed: string
		format: string
	}>({
		text: "",
		language: "en-us",
		speed: "0",
		format: "mp3",
	})

	const updateLanguage = (language: string) => {
		setSettings(prev => ({
			...prev,
			language: language,
		}))
	}

	const updateSpeed = (action: string) => {
		setSettings(prev => {
			let newSpeed = parseInt(prev.speed)

			if (action === "increase" && newSpeed < 10) {
				newSpeed++
			} else if (action === "decrease" && newSpeed > -10) {
				newSpeed--
			}

			return {
				...prev,
				speed: newSpeed.toString(),
			}
		})
	}

	const updateFormat = (format: string) => {
		setSettings(prev => ({
			...prev,
			format: format,
		}))
	}

	const handleFileChange = (e: React.ChangeEvent) => {
		const fileList = (e.target as HTMLInputElement).files

		if (fileList) {
			setSelectedFile(fileList[0])
			const reader = new FileReader()

			reader.onload = function (e) {
				if (e.target) {
					const contents = e.target.result
					if (typeof contents === "string") {
						setSettings(prev => ({
							...prev,
							text: contents,
						}))
					}
				}
			}

			reader.readAsText(fileList[0])
		} else {
			setErrorMsg("Something went wrong!")
		}
	}

	const translateIntoSpeech = async () => {
		setAudio("")
		const options = {
			method: "GET",
			url: "https://voicerss-text-to-speech.p.rapidapi.com/",
			params: {
				key: import.meta.env.VITE_API_KEY,
				src: settings.text,
				hl: settings.language,
				r: settings.speed,
				c: settings.format,
				f: "22khz_16bit_mono",
				b64: true,
			},
			headers: {
				"X-RapidAPI-Key": "c61689bb79msh55cd6c7c8cd48b4p1d49c0jsnd3744287c362",
				"X-RapidAPI-Host": "voicerss-text-to-speech.p.rapidapi.com",
			},
		}

		try {
			const res = await axios.request(options)

			if (settings.text) {
				setErrorMsg("")
				setAudio(res.data)
			} else {
				setErrorMsg("Upload correct file!")
			}
		} catch (err) {
			setErrorMsg("Error occured!")
		}
	}

	return (
		<div className='flex md:w-screen items-center flex-col gap-14 pt-6 md:p-10 text-cyan-500'>
			<label
				htmlFor='file'
				className='group w-full min-h-[40vh] md:min-h-[60vh] flex justify-center items-center flex-col gap-10 border-solid border-cyan-500 border-2 rounded-3xl px-4 py-4 md:px-48 md:py-24 hover:bg-cyan-500 transition cursor-pointer'>
				<i className='fa-solid fa-file-arrow-up text-8xl md:text-9xl group-hover:text-black transition'></i>
				<p className='text-3xl md:text-5xl uppercase group-hover:text-black font-bold transition'>
					upload
				</p>
			</label>
			<input
				type='file'
				id='file'
				className='hidden'
				accept='.txt'
				onChange={handleFileChange}
				multiple={false}
			/>
			{errorMsg && <p className='text-4xl'>{errorMsg}</p>}
			{selectedFile && (
				<p className='text-4xl'>
					<i className='fa-solid fa-file-lines'></i> {selectedFile?.name}
				</p>
			)}
			{isLanguagePageVisible && (
				<LanguagePage
					updateLanguage={updateLanguage}
					currentLanguage={settings.language}
					setIsLanguagePageVisible={setIsLanguagePageVisible}
				/>
			)}
			{isFormatPageVisible && (
				<FormatPage
					updateFormat={updateFormat}
					currentFormat={settings.format}
					setIsFormatPageVisible={setIsFormatPageVisible}
				/>
			)}

			<div className='flex flex-col gap-14'>
				<div className='flex flex-col flex-wrap items-center gap-6 xl:flex-row justify-center w-full'>
					<button
						className='flex gap-1 items-center bg-black text-cyan-500 hover:bg-cyan-500 hover:text-black uppercase rounded-full px-10 py-6 text-base sm:text-xl font-bold border-solid border-cyan-500 border-2 transition'
						onClick={() => setIsLanguagePageVisible(true)}>
						change language
						<span className='sm:text-lg font-normal'>
							{" "}
							({settings.language})
						</span>
					</button>

					<div className='flex items-center gap-2 bg-black text-cyan-500 uppercase rounded-full text-base sm:text-xl font-bold border-solid border-cyan-500 border-2 transition'>
						<button
							className='px-8 py-6 rounded-full hover:bg-cyan-500 hover:text-black transition'
							onClick={() => updateSpeed("decrease")}>
							<i className='fa-solid fa-minus'></i>
						</button>
						<p className='flex gap-1 items-center'>
							change speed
							<span className='sm:text-lg font-normal'>
								{" "}
								({settings.speed})
							</span>
						</p>
						<button
							className='px-8 py-6 rounded-full hover:bg-cyan-500 hover:text-black transition'
							onClick={() => updateSpeed("increase")}>
							<i className='fa-solid fa-plus'></i>
						</button>
					</div>

					<button
						className='flex gap-1 items-center bg-black text-cyan-500 hover:bg-cyan-500 hover:text-black uppercase rounded-full px-10 py-6 text-base sm:text-xl font-bold border-solid border-cyan-500 border-2 transition'
						onClick={() => setIsFormatPageVisible(true)}>
						change format
						<span className='sm:text-lg font-normal'> ({settings.format})</span>
					</button>
				</div>
				<div className='flex gap-7 items-end justify-center xl:self-end'>
					{audio && audio !== "" && (
						<a
							href={audio}
							download={`${selectedFile?.name.substring(
								0,
								selectedFile?.name.lastIndexOf(".")
							)}.${settings.format}`}>
							<button className='btn btn-primary'>
								<i className='fa-solid fa-download text-6xl'></i>
							</button>
						</a>
					)}
					<button
						className={` bg-cyan-500 text-[#121212] hover:bg-[#121212] hover:text-cyan-500 uppercase rounded-full px-10 py-6 text-base sm:text-xl font-bold border-solid border-cyan-500 border-2 transition mb-6 ${
							audio && audio !== "" && "mb-0"
						}`}
						onClick={translateIntoSpeech}>
						translate into speech
					</button>
				</div>
			</div>

			{audio && audio !== "" && (
				<audio controls className='bg-transparent mb-6'>
					<source src={audio} type='audio/mpeg' />
				</audio>
			)}
		</div>
	)
}

export default App
