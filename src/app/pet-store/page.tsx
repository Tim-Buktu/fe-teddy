"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import Link from "next/link"; // Import Link
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  type: "background" | "pet";
}

const backgrounds: Item[] = [
  {
    id: "cave",
    name: "Cave",
    price: 50,
    image: "/img/store/cave.png",
    type: "background",
  },
  {
    id: "waterfall",
    name: "Waterfall",
    price: 70,
    image: "/img/store/waterfall.jpg",
    type: "background",
  },
  {
    id: "forest",
    name: "Forest",
    price: 50,
    image: "/img/store/forest.png",
    type: "background",
  },
];

const pets: Item[] = [
  {
    id: "misty",
    name: "Misty",
    price: 100,
    image: "/img/store/misty.png",
    type: "pet",
  },
  {
    id: "foxy",
    name: "Foxy",
    price: 80,
    image: "/img/store/foxybetter.png",
    type: "pet",
  },
  {
    id: "hoggy",
    name: "Hoggy",
    price: 80,
    image: "/img/store/hoggy.png",
    type: "pet",
  },
  {
    id: "teddy",
    name: "Teddy",
    price: 60,
    image: "/img/store/teddy.png",
    type: "pet",
  },
];

export default function Component() {
  const router = useRouter();
  const [coins, setCoins] = useState(150);
  const [selectedBackground, setSelectedBackground] = useState<Item | null>(
    null
  );
  const [selectedPet, setSelectedPet] = useState<Item | null>(null);
  const [inventory, setInventory] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCoins = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`/api/state?token=${token}`);

        if (response.ok) {
          const data = await response.json();
          setCoins(data.user.coins); // Assuming the API returns { coins: number }
        } else {
          console.error("Failed to fetch coins");
          if (response.status === 401) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []); // Empty dependency array means this runs once when component mounts

  const handlePurchase = (item: Item) => {
    if (inventory.has(item.id)) {
      if (item.type === "background") {
        setSelectedBackground(item);
      } else {
        setSelectedPet(item);
      }
      return;
    }

    if (coins >= item.price) {
      setCoins((prev) => prev - item.price);
      setInventory((prev) => new Set(prev).add(item.id));
      if (item.type === "background") {
        setSelectedBackground(item);
      } else {
        setSelectedPet(item);
      }
      toast({
        title: "Purchase successful!",
        description: `You bought ${item.name} for ${item.price} coins.`,
      });
    } else {
      toast({
        title: "Not enough coins!",
        description: `You need ${item.price - coins} more coins to buy ${
          item.name
        }.`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#3C2A21]">
        {/* Left Panel - Store */}
        <div className="w-1/2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Pet Store</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1A120B] rounded-full border border-[#D5CEA3]">
              <span className="text-yellow-400 text-lg">🪙</span>
              <span className="font-bold text-white">{coins}</span>
            </div>
          </div>

          {/* Backgrounds Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-[#D5CEA3]">
              Backgrounds
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {backgrounds.map((bg) => (
                <Card
                  key={bg.id}
                  className={`relative overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-[#E5E5CB] bg-[#1A120B] border-[#D5CEA3] ${
                    inventory.has(bg.id) ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => handlePurchase(bg)}
                >
                  <img
                    src={bg.image}
                    alt={bg.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {!inventory.has(bg.id) && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70">
                      <div className="flex items-center justify-between">
                        <span className="text-[#D5CEA3] font-medium">
                          {bg.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">🪙</span>
                          <span className="text-white">{bg.price}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Pets Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#D5CEA3]">Pets</h2>
            <div className="grid grid-cols-2 gap-4">
              {pets.map((pet) => (
                <Card
                  key={pet.id}
                  className={`relative overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-[#E5E5CB] bg-[#1A120B] border-[#D5CEA3] ${
                    inventory.has(pet.id) ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => handlePurchase(pet)}
                >
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-40 object-cover p-4"
                  />
                  {!inventory.has(pet.id) && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70">
                      <div className="flex items-center justify-between">
                        <span className="text-[#D5CEA3] font-medium">
                          {pet.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">🪙</span>
                          <span className="text-white">{pet.price}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 p-6 relative">
          <Link href="/quizz">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 rounded-full bg-[#1A120B] text-white hover:bg-[#3C2A21]"
            >
              <X className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-full rounded-lg overflow-hidden relative bg-[#1A120B] border-2 border-[#D5CEA3]">
            {selectedBackground ? (
              <img
                src={selectedBackground.image}
                alt="Background"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#D5CEA3]">Select a background</p>
              </div>
            )}
            {selectedPet && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <img
                  src={selectedPet.image}
                  alt={selectedPet.name}
                  className="h-48 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
