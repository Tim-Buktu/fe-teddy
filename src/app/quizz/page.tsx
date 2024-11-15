"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Apple, MessageCircle, Coins, SmilePlus, Pill } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Question library
const questionLibrary = [
	{
		question:
			"Jika sebuah benda dilempar vertikal ke atas dengan kecepatan awal 20 m/s, berapa tinggi maksimum yang dapat dicapai?",
		answer: 20.4,
		explanation:
			"The correct answer is 20.4 meters because the maximum height is reached when the velocity becomes zero. Using the formula (v^2 = u^2 - 2gh), we calculate the height.",
	},
	{
		question:
			"Berapa panjang gelombang dari sebuah gelombang dengan frekuensi 50 Hz dan kecepatan gelombang 150 m/s?",
		answer: 3,
		explanation:
			"The wavelength is calculated using the formula ( lambda = \frac{v}{f} ), where v is the velocity (150 m/s) and f is the frequency (50 Hz). So, ( lambda = \frac{150}{50} = 3 ) meters.",
	},
	{
		question:
			"Sebuah mobil bergerak dengan kecepatan 30 m/s, dan tiba-tiba berhenti dalam waktu 5 detik. Berapa besar percepatan mobil tersebut?",
		answer: -6,
		explanation:
			"The acceleration is found using the formula (a = \frac{Delta v}{Delta t}), where ( Delta v = 0 - 30 = -30 , \text{m/s} ) and ( Delta t = 5 , \text{s} ), so ( a = \frac{-30}{5} = -6 , \text{m/s²} ).",
	},
	{
		question:
			"Berapa banyak energi potensial yang dimiliki sebuah benda dengan massa 10 kg yang berada di ketinggian 5 meter?",
		answer: 490,
		explanation:
			"The gravitational potential energy is calculated using the formula (E_p = mgh), where (m = 10 , \text{kg}), (g = 9.8 , \text{m/s²}), and (h = 5 , \text{m}). So, (E_p = 10 \times 9.8 \times 5 = 490 , \text{J}).",
	},
	{
		question:
			"Apa yang terjadi dengan arah gerak cahaya ketika melewati dua medium yang berbeda?",
		answer: "Refraksi",
		explanation:
			"When light passes from one medium to another, it bends at the interface, a phenomenon known as refraction. The degree of bending depends on the refractive indices of the two media.",
	},
	{
		question:
			"Sebuah benda mengalami gerak melingkar dengan kecepatan konstan 10 m/s dan jari-jari lintasan 5 m. Berapa percepatan sentripetal benda tersebut?",
		answer: 2,
		explanation:
			"The centripetal acceleration is given by ( a_c = \frac{v^2}{r} ), where (v = 10 , \text{m/s}) and (r = 5 , \text{m}). So, (a_c = \frac{10^2}{5} = 2 , \text{m/s²}).",
	},
	{
		question:
			"Jika suatu benda bergerak dengan kecepatan konstan 20 m/s, berapa besar usaha yang dilakukan oleh gaya total yang bekerja pada benda tersebut?",
		answer: 0,
		explanation:
			"The work done is zero because the object is moving with constant velocity, meaning the net force and acceleration are both zero. No work is done when there is no change in kinetic energy.",
	},
	{
		question: "Apa yang dimaksud dengan hukum kekekalan energi?",
		answer: "Energi total dalam suatu sistem terisolasi tetap konstan.",
		explanation:
			"According to the law of conservation of energy, energy cannot be created or destroyed but only converted from one form to another.",
	},
	{
		question:
			"Sebuah bola jatuh bebas dari ketinggian 10 meter. Berapa waktu yang dibutuhkan bola untuk mencapai tanah?",
		answer: 1.43,
		explanation:
			"The time taken is calculated using the formula (t = sqrt{\frac{2h}{g}}), where (h = 10 , \text{m}) and (g = 9.8 , \text{m/s²}). So, (t = sqrt{\frac{2 \times 10}{9.8}} = 1.43 , \text{seconds}).",
	},
	{
		question:
			"Jika suatu benda bergerak dengan percepatan 2 m/s², berapa kecepatan benda tersebut setelah 5 detik jika kecepatan awalnya 0?",
		answer: 10,
		explanation:
			"The velocity is found using the formula (v = u + at), where (u = 0 , \text{m/s}), (a = 2 , \text{m/s²}), and (t = 5 , \text{s}). So, (v = 0 + 2 \times 5 = 10 , \text{m/s}).",
	},
	{
		question:
			"Apa yang menyebabkan benda jatuh mengalami percepatan gravitasi yang sama?",
		answer: "Gaya gravitasi",
		explanation:
			"All objects fall with the same acceleration due to gravity, regardless of their mass, because the force of gravity is proportional to the mass, and so is the inertia, which results in the same acceleration.",
	},
	{
		question:
			"Sebuah mobil bergerak dengan kelajuan 60 km/h. Berapa kecepatan mobil dalam satuan meter per detik?",
		answer: 16.67,
		explanation:
			"To convert the speed from km/h to m/s, we use the conversion factor (1 , \text{km/h} = \frac{1000}{3600} , \text{m/s}). So, (60 , \text{km/h} = 60 \times \frac{1000}{3600} = 16.67 , \text{m/s}).",
	},
	{
		question:
			"Berapa besar gaya gravitasi yang bekerja pada sebuah benda dengan massa 5 kg yang berada di permukaan bumi?",
		answer: 49,
		explanation:
			"The force is calculated using (F = mg), where (m = 5 , \text{kg}) and (g = 9.8 , \text{m/s²}). So, (F = 5 \times 9.8 = 49 , \text{N}).",
	},
	{
		question:
			"Sebuah bola dilemparkan ke atas dengan kecepatan 15 m/s. Berapa lama bola itu mencapai titik tertinggi?",
		answer: 1.53,
		explanation:
			"At the highest point, the velocity is zero. Using the formula (v = u + at), where (v = 0), (u = 15 , \text{m/s}), and (a = -9.8 , \text{m/s²}), we find (t = \frac{15}{9.8} = 1.53 , \text{seconds}).",
	},
	{
		question:
			"Berapa besar tegangan yang diperlukan untuk mengalirkan arus 2 A melalui resistor dengan resistansi 10 Ω?",
		answer: 20,
		explanation:
			"The voltage is calculated using Ohm's law: (V = IR), where (I = 2 , \text{A}) and (R = 10 , Omega). So, (V = 2 \times 10 = 20 , \text{V}).",
	},
	{
		question:
			"Jika dua benda yang berbeda massa dijatuhkan bersamaan dari ketinggian yang sama, mana yang akan sampai lebih dulu?",
		answer: "Keduanya sampai bersamaan",
		explanation:
			"In the absence of air resistance, all objects fall with the same acceleration due to gravity and will hit the ground at the same time.",
	},
	{
		question:
			"Berapa besar gaya yang dibutuhkan untuk memberikan percepatan 4 m/s² pada sebuah benda dengan massa 3 kg?",
		answer: 12,
		explanation:
			"The force is calculated using Newton's second law: (F = ma), where (m = 3 , \text{kg}) and (a = 4 , \text{m/s²}). So, (F = 3 \times 4 = 12 , \text{N}).",
	},
];

export default function Component() {
	const [gameStarted, setGameStarted] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [questionNumber, setQuestionNumber] = useState(1);
	const [answer, setAnswer] = useState("");
	const [questionSubmitted, setQuestionSubmitted] = useState(false);
	const [explanation, setExplanation] = useState("");
	const [coins, setCoins] = useState(100);
	const [health, setHealth] = useState(100);
	const [apples, setApples] = useState(100);
	const [laughter, setLaughter] = useState(100);
	const [medicine, setMedicine] = useState(100);
	const router = useRouter();
	if (!localStorage.getItem("token")) router.push("/login");
	const token = localStorage.getItem("token");
	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const response = await fetch(
					`http://localhost:3001/api/state?token=${token}`,
				);
				if (!response.ok) throw new Error("Failed to fetch status");
				const data = await response.json();

				setCoins(data.user.coins);
				setHealth(data.user.health);
				setApples(data.user.apples);
				setLaughter(data.user.laughter);
				setMedicine(data.user.medicine);
			} catch (error) {
				console.error("Error fetching status:", error);
				toast({
					title: "Error",
					description: "Failed to load game status",
					variant: "destructive",
				});
			}
		};

		if (token) {
			fetchStatus();
		}
	}, [token]);

	useEffect(() => {
		const updateStatus = async () => {
			try {
				await fetch(`http://localhost:3001/api/state?token=${token}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						coins,
						health,
						apples,
						laughter,
						medicine,
					}),
				});
			} catch (error) {
				console.error("Error updating status:", error);
			}
		};

		if (token) {
			updateStatus();
		}
	}, [coins, health, apples, laughter, medicine, token]);

	const updateStatusItem = (item, change) => {
		const updateState = (prevState) => {
			let newValue = prevState + change;
			if (newValue < 0) newValue = 0; // Ensure the value doesn't go negative

			// Additional check for Coins to prevent going negative
			if (item === "Coins" && newValue < 0) {
				toast({
					title: "Action Canceled!",
					description: "Not enough coins to complete this action.",
					variant: "destructive",
				});
				return prevState; // Prevent coin decrement if not enough coins
			}

			if (newValue > 100 && item !== "Coins") {
				toast({
					title: "Action Canceled!",
					description: `${item} cannot exceed 100.`,
					variant: "destructive",
				});
				return prevState; // Prevent any value from exceeding 100, except Coins
			}

			return newValue;
		};

		switch (item) {
			case "Coins":
				setCoins(updateState);
				break;
			case "Apple":
				setApples(updateState);
				if (change > 0 && coins >= 2) {
					updateStatusItem("Coins", -2); // Deduct 2 coins for apple action
					toast({
						title: "Fed Teddy an apple!",
						description: "You spent 2 coins.",
					});
				}
				break;
			case "Laughter":
				setLaughter(updateState);
				if (change > 0 && coins >= 2) {
					updateStatusItem("Coins", -2); // Deduct 2 coins for laughter action
					toast({
						title: "Made Teddy laugh!",
						description: "You spent 2 coins.",
					});
				}
				break;
			case "Health":
				setHealth(updateState);
				if (change > 0 && coins >= 5) {
					updateStatusItem("Coins", -5); // Deduct 5 coins for health action
					toast({
						title: "Gave Teddy medicine!",
						description: "You spent 5 coins.",
					});
				}
				break;
			case "Medicine":
				setMedicine(updateState);
				if (change > 0 && coins >= 2) {
					updateStatusItem("Coins", -2); // Deduct 2 coins for medicine action
					toast({
						title: "Gave Teddy medicine!",
						description: "You spent 2 coins.",
					});
				}
				break;
		}
	};

	const checkGameOver = () => {
		if (
			coins === 0 ||
			health === 0 ||
			apples === 0 ||
			laughter === 0 ||
			medicine === 0
		) {
			toast({
				title: "Game Over!",
				description: "You have lost the game.",
				variant: "destructive",
			});
			resetGame();
		}
	};

	const resetGame = () => {
		setGameStarted(false);
		setCurrentQuestionIndex(0);
		setQuestionNumber(1);
		setAnswer("");
		setQuestionSubmitted(false);
		setExplanation("");
		setCoins(100);
		setHealth(100);
		setApples(100);
		setLaughter(100);
		setMedicine(100);
	};

	const loadQuestion = () => {
		setAnswer("");
		setExplanation("");
		setQuestionSubmitted(false);
	};

	const handleSkipQuestion = () => {
		toast({
			title: "Question skipped",
			description: "You lost 5 coins.",
			variant: "warning",
		});
		updateStatusItem("Coins", -5);
		updateStatusItem("Apple", -1);
		updateStatusItem("Laughter", -1);
		updateStatusItem("Health", -3);
		moveToNextQuestion();
	};

	const moveToNextQuestion = () => {
		setCurrentQuestionIndex((prevIndex) => {
			const nextIndex = prevIndex + 1;
			if (nextIndex >= questionLibrary.length) {
				toast({
					title: "Quiz completed!",
					description: "Restarting from the beginning.",
				});
				return 0;
			}
			return nextIndex;
		});
		setQuestionNumber((prevNumber) => {
			const nextNumber = prevNumber + 1;
			if (nextNumber > questionLibrary.length) {
				return 1;
			}
			return nextNumber;
		});
		loadQuestion();
	};

	const handleSignOut = () => {
		localStorage.removeItem("token");
		router.push("/login");
	};

	const handleSubmit = () => {
		if (!questionSubmitted) {
			const currentQuestion = questionLibrary[currentQuestionIndex];
			const userAnswer = parseFloat(answer);

			if (!isNaN(userAnswer)) {
				setQuestionSubmitted(true);
				if (userAnswer === currentQuestion.answer) {
					toast({
						title: "Correct!",
						description: "You earned 4 coins.",
					});
					updateStatusItem("Coins", 4);
					setExplanation(`Great job! ${currentQuestion.explanation}`);
				} else {
					toast({
						title: "Wrong answer",
						description: "You lost 5 coins and 2 health.",
						variant: "destructive",
					});
					updateStatusItem("Coins", -5);
					updateStatusItem("Health", -5);
					updateStatusItem("Apple", -2);
					updateStatusItem("Laughter", -2);
					setExplanation(
						`The correct answer was ${currentQuestion.answer}. ${currentQuestion.explanation}`,
					);
				}
			} else {
				toast({
					title: "Invalid input",
					description: "Please enter a valid number.",
					variant: "destructive",
				});
			}
		} else {
			moveToNextQuestion();
		}
	};

	if (!gameStarted) {
		return (
			<div className="min-h-screen bg-[#2D2522] flex flex-col items-center justify-center p-4 gap-4">
				<Button
					onClick={() => setGameStarted(true)}
					className="w-full max-w-md bg-[#8B4513] hover:bg-[#A0522D] text-white text-lg py-6 rounded-full"
				>
					Let's Play
				</Button>

				<Button onClick={handleSignOut}>Sign Out</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#2D2522] flex items-center justify-center p-4">
			<div className="w-full max-w-7xl grid lg:grid-cols-2 gap-6">
				{/* Left Column - Quiz Interface */}
				<div className="space-y-6 lg:p-6">
					{/* Question Header */}
					<div className="relative">
						<div className="absolute inset-0 bg-[#8B4513] rounded-lg transform -rotate-2"></div>
						<div className="relative bg-[#A0522D] text-white p-4 rounded-lg flex items-center gap-2">
							<div className="w-8 h-8 bg-[#DEB887] rounded-full flex items-center justify-center">
								<div className="w-6 h-6 bg-[#8B4513] rounded-full"></div>
							</div>
							<h2 className="text-xl font-bold">Question {questionNumber}</h2>
						</div>
					</div>

					{/* Question Content */}
					<div className="bg-white rounded-lg p-6 shadow-lg min-h-[200px]">
						<p>{questionLibrary[currentQuestionIndex].question}</p>
					</div>

					{/* Answer Input */}
					<div className="bg-white rounded-lg p-4 shadow-lg">
						<Input
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							className="w-full"
							placeholder="Type your answer here..."
						/>
					</div>

					{/* Explanation Box */}
					{explanation && (
						<div
							id="answer-explanation"
							className="bg-white rounded-lg p-4 shadow-lg"
						>
							<p>{explanation}</p>
						</div>
					)}

					{/* Submit Button */}
					<div className="flex flex-col gap-4 items-center">
						<Button
							onClick={handleSubmit}
							className="w-full max-w-md bg-[#8B4513] hover:bg-[#A0522D] text-white text-lg py-6 rounded-full"
						>
							{questionSubmitted ? "Next Question" : "Submit Answer"}
						</Button>
						<button
							onClick={handleSkipQuestion}
							className="text-white/80 hover:text-white underline"
						>
							Skip Question&gt;
						</button>
					</div>
				</div>

				{/* Right Column - Forest Scene */}
				<div className="relative rounded-2xl overflow-hidden bg-[#7CB342]">
					{/* Top Stats */}
					<div className="absolute top-4 right-4 flex gap-4">
						<Link
							href="/pet-store"
							className="bg-white/90 backdrop-blur rounded-full py-2 px-4 flex items-center gap-2 hover:bg-white/100 transition-colors"
						>
							<Coins className="w-6 h-6 text-yellow-500" />
							<span className="font-bold">{coins}</span>
						</Link>
						<div className="bg-white/90 backdrop-blur rounded-xl p-4 flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<Apple className="w-5 h-5 text-red-500" />
								<span className="font-bold">{apples}%</span>
							</div>
							<div className="flex items-center gap-2">
								<SmilePlus className="w-5 h-5 text-yellow-500" />
								<span className="font-bold">{laughter}%</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageCircle className="w-5 h-5 text-blue-500" />
								<span className="font-bold">{medicine}%</span>
							</div>
						</div>
					</div>

					{/* Character Name and Progress */}
					<div className="absolute top-1/4 right-8 bg-white/90 backdrop-blur rounded-lg p-4 max-w-[200px]">
						<h3 className="text-xl font-bold mb-2">Teddy</h3>
						<Progress value={health} className="h-2 bg-gray-200" />
						<p className="text-right text-sm mt-1">{health}/100</p>
					</div>

					{/* Side Icons */}
					<div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-4">
						<button
							onClick={() => updateStatusItem("Apple", 1)}
							className="bg-white rounded-r-full p-4"
						>
							<Apple className="w-6 h-6 text-red-500" />
						</button>
						<button
							onClick={() => updateStatusItem("Laughter", 1)}
							className="bg-white rounded-r-full p-4"
						>
							<SmilePlus className="w-6 h-6 text-yellow-500" />
						</button>
						<button
							onClick={() => updateStatusItem("Health", 1)}
							className="bg-white rounded-r-full p-4"
						>
							<Pill className="w-6 h-6 text-blue-500" />
						</button>
					</div>

					{/* Forest Background */}
					<div className="h-4/5 min-h-[800px] bg-[url('/img/store/cave.png')] bg-cover bg-center flex items-end justify-center border-[#a0522d] border-4">
						<img
							src="/img/store/teddy.png"
							alt="Forest Scene"
							className="w-3/4 h-auto object-cover"
						/>
					</div>
				</div>
			</div>
			<Toaster />
		</div>
	);
}
