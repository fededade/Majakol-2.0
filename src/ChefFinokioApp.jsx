import React, { useState, useMemo, useEffect } from 'react';
import { ChefHat, ShoppingCart, ArrowLeft, Leaf, Flame, Utensils, CheckCircle, Circle, Banknote, Clock, Users, Sun, Moon, CalendarDays, Sparkles, RefreshCw, Shuffle, Loader2, Brain, Lightbulb, Fish, Target } from 'lucide-react';

// --- API CONFIGURATION ---
const API_KEY = "AIzaSyCuuDDeUyWbdd50T0kw8hXWKa94smPMEEw";

// --- IMAGE MAPPING ---
const IMAGE_CATEGORIES = {
  fish: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=800"
  ],
  meat: [
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800"
  ],
  pasta: [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551326844-f459e292fd79?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800"
  ],
  veggie: [
    "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1520072959219-c595dc3f3dbd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  ],
  salad: [
    "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
  ]
};

const getRandomImage = (category) => {
  const cat = category?.toLowerCase();
  const list = IMAGE_CATEGORIES[cat] || IMAGE_CATEGORIES.veggie; 
  return list[Math.floor(Math.random() * list.length)];
};

// --- DATA ---
const INITIAL_MEALS = {
  pranzo: [
    {
      id: "p1",
      title: "Bowl di Salmone e Quinoa",
      subtitle: "L'Equilibrio Perfetto",
      description: "Un piatto unico fresco e nutriente. Salmone ricco di Omega-3, quinoa per carboidrati complessi e avocado per grassi sani.",
      image: IMAGE_CATEGORIES.fish[0],
      tags: ["Proteine Alte", "Gluten Free", "Omega-3"],
      nutrition: { protein: "35g", carbs: "45g", fiber: "8g", calories: "520 kcal" },
      time: "25 min", servings: 2,
      steps: ["Sciacqua la quinoa e cuocila.", "Marina il salmone con soia.", "Taglia avocado e verdure.", "Componi la bowl.", "Condisci con olio e sesamo."],
      ingredients: [
        { name: "Salmone Fresco", qty: "300g", cost: 9.50 },
        { name: "Quinoa", qty: "150g", cost: 2.20 },
        { name: "Avocado", qty: "1 intero", cost: 1.80 },
        { name: "Pomodorini", qty: "200g", cost: 1.50 },
        { name: "Salsa Soia", qty: "q.b.", cost: 0.50 }
      ]
    },
    {
      id: "p2",
      title: "Pollo al Curry con Riso",
      subtitle: "Energia Speziata",
      description: "Petto di pollo tenero cotto in una crema di curry e latte di cocco, servito con riso basmati profumato.",
      image: IMAGE_CATEGORIES.meat[0],
      tags: ["Energizzante", "Speziato", "Comfort Food"],
      nutrition: { protein: "40g", carbs: "60g", fiber: "4g", calories: "610 kcal" },
      time: "35 min", servings: 2,
      steps: ["Rosola il pollo.", "Aggiungi curry e spezie.", "Versa latte di cocco.", "Cuoci il riso.", "Servi caldo."],
      ingredients: [
        { name: "Petto di Pollo", qty: "400g", cost: 5.50 },
        { name: "Latte di Cocco", qty: "200ml", cost: 1.90 },
        { name: "Riso Basmati", qty: "180g", cost: 1.20 },
        { name: "Curry", qty: "10g", cost: 0.80 }
      ]
    },
    {
      id: "p3",
      title: "Pasta Integrale Mediterranea",
      subtitle: "Tradizione Veggie",
      description: "Pasta integrale ricca di fibre condita con un sugo fresco di melanzane, pomodoro, olive e feta greca.",
      image: IMAGE_CATEGORIES.pasta[0],
      tags: ["Vegetariano", "Fibre Alte", "Veloce"],
      nutrition: { protein: "18g", carbs: "70g", fiber: "12g", calories: "480 kcal" },
      time: "20 min", servings: 2,
      steps: ["Bollisci l'acqua.", "Salta le melanzane.", "Aggiungi pomodoro e olive.", "Scola la pasta.", "Aggiungi feta."],
      ingredients: [
        { name: "Pasta Integrale", qty: "200g", cost: 1.10 },
        { name: "Melanzana", qty: "1 grande", cost: 1.30 },
        { name: "Pomodori", qty: "250g", cost: 1.00 },
        { name: "Feta", qty: "100g", cost: 2.50 }
      ]
    }
  ],
  cena: [
    {
      id: "c1",
      title: "Vellutata di Zucca",
      subtitle: "Detox & Leggero",
      description: "Una crema avvolgente e leggera. I ceci arrostiti aggiungono proteine e croccantezza.",
      image: IMAGE_CATEGORIES.veggie[0],
      tags: ["Vegano", "Low Carb", "Digeribile"],
      nutrition: { protein: "15g", carbs: "30g", fiber: "14g", calories: "320 kcal" },
      time: "30 min", servings: 2,
      steps: ["Cuoci la zucca nel brodo.", "Frulla tutto.", "Arrostisci i ceci con paprika.", "Servi caldo."],
      ingredients: [
        { name: "Zucca", qty: "500g", cost: 1.50 },
        { name: "Ceci in scatola", qty: "250g", cost: 0.90 },
        { name: "Brodo Vegetale", qty: "500ml", cost: 0.50 }
      ]
    },
    {
      id: "c2",
      title: "Filetto di Orata al Cartoccio",
      subtitle: "Omega-3 & Salute",
      description: "Cottura al vapore nel cartoccio per preservare tutti i nutrienti e il gusto delicato.",
      image: IMAGE_CATEGORIES.fish[1],
      tags: ["Pesce", "Senza Grassi", "Elegante"],
      nutrition: { protein: "45g", carbs: "5g", fiber: "2g", calories: "380 kcal" },
      time: "25 min", servings: 2,
      steps: ["Pulisci i filetti.", "Metti su carta forno con pomodorini.", "Chiudi il cartoccio.", "Inforna a 180°C.", "Servi chiuso."],
      ingredients: [
        { name: "Filetti Orata", qty: "2 pz", cost: 8.00 },
        { name: "Pomodorini", qty: "150g", cost: 1.20 },
        { name: "Olive", qty: "30g", cost: 1.50 }
      ]
    },
    {
      id: "c3",
      title: "Burger di Tacchino e Zucchine",
      subtitle: "Fit & Proteico",
      description: "Un secondo piatto gustoso ma magro. L'alternativa perfetta alla carne rossa.",
      image: IMAGE_CATEGORIES.meat[1],
      tags: ["Keto", "Alto Proteico", "Gluten Free"],
      nutrition: { protein: "40g", carbs: "8g", fiber: "5g", calories: "410 kcal" },
      time: "20 min", servings: 2,
      steps: ["Grattugia zucchine.", "Mescola con tacchino.", "Forma burger.", "Cuoci su piastra.", "Servi con insalata."],
      ingredients: [
        { name: "Macinato Tacchino", qty: "350g", cost: 4.50 },
        { name: "Zucchine", qty: "2 medie", cost: 0.80 },
        { name: "Insalata", qty: "1 busta", cost: 1.50 }
      ]
    }
  ]
};

// --- COMPONENTS ---

const AppLogo = ({ size = "default" }) => {
    const isLarge = size === "large";
    
    // MODIFICA: Dimensioni aumentate di circa il 30%
    const containerClasses = isLarge ? "w-32 h-32 border-4 shadow-xl" : "w-16 h-16 border-2 shadow-md";
    const iconSize = isLarge ? 64 : 32;
    
    // Stato per gestire errore caricamento immagine
    const [imageError, setImageError] = useState(false);

    // Percorso del file logo.png che l'utente deve mettere in /public
    const logoSrc = "/logo.png";

    if (imageError) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 rounded-full ${containerClasses} border-green-500`}>
                <ChefHat size={iconSize} className="text-white" strokeWidth={2.5} />
            </div>
        );
    }

    return (
      <div className={`overflow-hidden flex items-center justify-center bg-white rounded-full ${containerClasses} border-green-500 relative`}>
        <img 
            src={logoSrc} 
            alt="Chef Finokio Logo" 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
        />
      </div>
    );
};

const LoadingOverlay = ({ text }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full text-center">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="transform scale-75">
                         <AppLogo />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">Chef Finokio sta pensando...</h3>
                <p className="text-gray-500 text-sm mt-2">{text}</p>
            </div>
        </div>
    </div>
);

// MAIN APP COMPONENT
export default function ChefFinokioApp() {
  const [view, setView] = useState('welcome');
  const [mealType, setMealType] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [dailyMeals, setDailyMeals] = useState(INITIAL_MEALS);
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Wizard State
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardPreferences, setWizardPreferences] = useState({ base: '', style: '' });

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(today.toLocaleDateString('it-IT', options));
  }, []);

  const callGemini = async (prompt) => {
    if (!API_KEY) return null;
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            }
        );
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) throw new Error("No data");
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini Error:", error);
        return null;
    }
  };

  const handleSetMealType = (type) => {
      setMealType(type);
      setView('mode_selection'); // New flow: go to mode selection instead of home
  };

  const generateRecipes = async (preferences = null) => {
    setIsLoading(true);
    setLoadingText(preferences ? "Chef Finokio sta creando il menu su misura..." : "Chef Finokio sta inventando qualcosa di speciale...");
    
    if(!API_KEY) {
        // Fallback for demo without API Key (or simulazione)
        setTimeout(() => {
            setIsLoading(false);
            if (!preferences) {
                // Se no API e no preferences, usa statici o avvisa
                if(dailyMeals[mealType]?.length > 0) {
                     setView('home'); // Usa quelli che ci sono
                } else {
                     alert("Per usare l'IA reale, inserisci la tua API KEY nel codice.");
                     setView('home'); 
                }
            } else {
                alert("Per generare ricette personalizzate serve l'API KEY. Ti mostrerò il menu standard.");
                setView('home');
            }
        }, 1500);
        return;
    }
    
    let promptContext = "";
    if (preferences) {
        promptContext = `L'utente vuole cucinare qualcosa a base di ${preferences.base} con uno stile ${preferences.style}.`;
    } else {
        promptContext = `Scegli tu gli ingredienti in base alla creatività e stagionalità.`;
    }

    const prompt = `Genera 3 ricette per ${mealType}. ${promptContext} JSON array output con struttura: [{id, title, subtitle, description, category, tags[], nutrition{protein, carbs, fiber, calories}, time, servings, steps[], ingredients[{name, qty, cost}]}]`;
    
    const newMeals = await callGemini(prompt);
    
    if (newMeals && Array.isArray(newMeals)) {
        const mealsWithImages = newMeals.map(meal => ({
            ...meal,
            image: getRandomImage(meal.category)
        }));
        setDailyMeals(prev => ({ ...prev, [mealType]: mealsWithImages }));
        setView('home');
    }
    
    setIsLoading(false);
  };

  const handleGenerateDaily = () => generateRecipes(null); // Default random generation

  const handleWizardOption = (key, value) => {
      setWizardPreferences(prev => ({ ...prev, [key]: value }));
      if (key === 'base') {
          setWizardStep(1);
      } else if (key === 'style') {
          // Final step, trigger generation
          const finalPrefs = { ...wizardPreferences, [key]: value };
          generateRecipes(finalPrefs);
      }
  };

  const handleGenerateVariant = async () => {
    if(!API_KEY) { alert("Per usare questa funzione, inserisci la tua API Key Gemini nel codice."); return; }
    setIsLoading(true);
    setLoadingText("Sto elaborando una variante...");
    const prompt = `Crea una variante della ricetta: ${JSON.stringify(selectedMeal)}. Restituisci JSON con stessa struttura.`;
    const variant = await callGemini(prompt);
    if (variant) {
        variant.image = selectedMeal.image;
        variant.title = "Variante: " + (variant.title || selectedMeal.title);
        variant.id = selectedMeal.id + "_var";
        handleSelectMeal(variant);
    }
    setIsLoading(false);
  };

  const handleRemixIngredients = async () => {
    if(!API_KEY) { alert("Per usare questa funzione, inserisci la tua API Key Gemini nel codice."); return; }
    setIsLoading(true);
    setLoadingText("Sto remixando gli ingredienti...");
    const mainIngredients = selectedMeal.ingredients.map(i => i.name).slice(0, 3).join(", ");
    const prompt = `Crea una nuova ricetta usando questi ingredienti: ${mainIngredients}. Restituisci JSON con struttura completa.`;
    const remix = await callGemini(prompt);
    if (remix) {
        remix.image = getRandomImage(remix.category);
        remix.title = "Remix: " + (remix.title || "Nuova Ricetta");
        remix.id = "remix_" + Date.now();
        handleSelectMeal(remix);
    }
    setIsLoading(false);
  };

  const handleSelectMeal = (meal) => { setSelectedMeal(meal); setCheckedIngredients({}); setView('detail'); };
  const resetApp = () => { setView('welcome'); setMealType(null); setSelectedMeal(null); setWizardStep(0); setWizardPreferences({ base: '', style: '' }); };
  const toggleIngredient = (index) => { setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] })); };
  
  const calculateCosts = useMemo(() => {
    if (!selectedMeal) return { total: 0, remaining: 0 };
    let total = 0; 
    let remaining = 0;
    selectedMeal.ingredients.forEach((ing, index) => {
      total += ing.cost;
      if (!checkedIngredients[index]) { remaining += ing.cost; }
    });
    return { total, remaining };
  }, [selectedMeal, checkedIngredients]);

  // Views
  const renderWelcome = () => (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] px-4 space-y-12">
      <div className="text-center space-y-4">
         <div className="flex justify-center mb-6">
             <div className="transform hover:scale-105 transition duration-300">
                <AppLogo size="large" />
             </div>
         </div>
         <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-serif">
            Chef <span className="text-green-600">Finokio</span>
         </h1>
         <p className="text-xl text-gray-500 font-light tracking-widest uppercase">Majakol</p>
         <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-gray-500 text-sm border border-gray-100 mt-4">
            <CalendarDays size={16} className="text-green-600"/>
            <span className="capitalize">{currentDate}</span>
         </div>
         <p className="text-gray-600 max-w-md mx-auto pt-4">L'Intelligenza Artificiale in cucina.<br/>Per quale momento della giornata cuciniamo?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <button onClick={() => handleSetMealType('pranzo')} className="group bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-400 p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center gap-4">
            <div className="bg-orange-200 p-4 rounded-full group-hover:bg-orange-300 transition"><Sun size={48} className="text-orange-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800">Menu Pranzo</h2>
        </button>
        <button onClick={() => handleSetMealType('cena')} className="group bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 hover:border-indigo-400 p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center gap-4">
            <div className="bg-indigo-200 p-4 rounded-full group-hover:bg-indigo-300 transition"><Moon size={48} className="text-indigo-600" /></div>
            <h2 className="text-2xl font-bold text-gray-800">Menu Cena</h2>
        </button>
      </div>
    </div>
  );

  const renderModeSelection = () => (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-10">
      <div className="text-center max-w-lg mx-auto">
          <button onClick={() => setView('welcome')} className="mb-6 flex items-center justify-center mx-auto text-gray-400 hover:text-green-600 transition text-sm"><ArrowLeft size={16} className="mr-1" /> Indietro</button>
          <h2 className="text-3xl font-bold text-gray-800 font-serif mb-3">Come vuoi procedere?</h2>
          <p className="text-gray-500">Scegli se affidarti totalmente alla creatività di Majakol o dare qualche indicazione.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Opzione 1: Automatica */}
          <button 
            onClick={() => generateRecipes(null)}
            className="group relative bg-white border-2 border-purple-100 hover:border-purple-400 hover:bg-purple-50 p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-left"
          >
              <div className="absolute top-6 right-6 bg-purple-100 p-3 rounded-full text-purple-600 group-hover:scale-110 transition"><Brain size={32} /></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 pr-12">Lascia fare a Majakol</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                  L'IA analizzerà milioni di combinazioni per proporti 3 ricette equilibrate e sorprendenti. Ideale se non hai idee.
              </p>
              <div className="mt-6 flex items-center text-purple-600 font-bold text-sm">
                  <Sparkles size={16} className="mr-2" /> Generazione Automatica
              </div>
          </button>

          {/* Opzione 2: Wizard */}
          <button 
            onClick={() => { setWizardStep(0); setView('wizard'); }}
            className="group relative bg-white border-2 border-green-100 hover:border-green-400 hover:bg-green-50 p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-left"
          >
              <div className="absolute top-6 right-6 bg-green-100 p-3 rounded-full text-green-600 group-hover:scale-110 transition"><Lightbulb size={32} /></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 pr-12">Ho qualche idea...</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                  Hai del pollo in frigo? O voglia di qualcosa di leggero? Guida lo Chef verso la ricetta perfetta per te.
              </p>
              <div className="mt-6 flex items-center text-green-600 font-bold text-sm">
                  <Target size={16} className="mr-2" /> Configurazione Guidata
              </div>
          </button>
      </div>
    </div>
  );

  const renderWizard = () => {
      const isStepBase = wizardStep === 0;
      
      const baseOptions = [
          { label: "Pesce", icon: <Fish size={24}/>, value: "Pesce" },
          { label: "Carne", icon: "🍖", value: "Carne" },
          { label: "Pollo", icon: "🍗", value: "Pollo" },
          { label: "Pasta/Riso", icon: "🍝", value: "Pasta o Riso" },
          { label: "Verdure", icon: <Leaf size={24}/>, value: "Verdure e Legumi" },
          { label: "Uova/Formaggi", icon: "🧀", value: "Uova o Formaggi" }
      ];

      const styleOptions = [
          { label: "Leggero & Fit", desc: "Poche calorie, equilibrato", value: "Leggero, sano e ipocalorico" },
          { label: "Saporito & Ricco", desc: "Comfort food avvolgente", value: "Saporito, ricco e gustoso" },
          { label: "Veloce & Easy", desc: "Pronto in 15 minuti", value: "Molto veloce e semplice da preparare" },
          { label: "Gourmet", desc: "Per stupire gli ospiti", value: "Raffinato, stile ristorante" }
      ];

      return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] px-4 max-w-2xl mx-auto">
            <button onClick={() => isStepBase ? setView('mode_selection') : setWizardStep(0)} className="self-start mb-8 flex items-center text-gray-400 hover:text-green-600 transition text-sm"><ArrowLeft size={16} className="mr-1" /> Indietro</button>
            
            <div className="w-full mb-8">
                <div className="flex justify-between mb-2">
                    <span className={`text-sm font-bold ${isStepBase ? 'text-green-600' : 'text-green-800'}`}>Step 1: Ingrediente</span>
                    <span className={`text-sm font-bold ${!isStepBase ? 'text-green-600' : 'text-gray-300'}`}>Step 2: Stile</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-green-500 transition-all duration-500 ${isStepBase ? 'w-1/2' : 'w-full'}`}></div>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 font-serif mb-8 text-center">
                {isStepBase ? "Qual è l'ingrediente protagonista?" : "Che carattere diamo al piatto?"}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {isStepBase ? (
                    baseOptions.map((opt) => (
                        <button 
                            key={opt.label}
                            onClick={() => handleWizardOption('base', opt.value)}
                            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all hover:-translate-y-1 hover:shadow-md gap-3"
                        >
                            <div className="text-3xl text-gray-700">{opt.icon}</div>
                            <span className="font-bold text-gray-700">{opt.label}</span>
                        </button>
                    ))
                ) : (
                    styleOptions.map((opt) => (
                        <button 
                            key={opt.label}
                            onClick={() => handleWizardOption('style', opt.value)}
                            className="col-span-1 md:col-span-3 flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all hover:-translate-y-1 hover:shadow-md text-left gap-4"
                        >
                            <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={24} /></div>
                            <div>
                                <div className="font-bold text-gray-800 text-lg">{opt.label}</div>
                                <div className="text-gray-500 text-sm">{opt.desc}</div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
      );
  };

  const renderHome = () => {
    const currentMeals = dailyMeals[mealType] || [];
    const isLunch = mealType === 'pranzo';
    return (
        <div className="animate-fade-in space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-b border-gray-100">
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-green-600 font-bold uppercase tracking-wider text-sm mb-2">
                    {isLunch ? <Sun size={16}/> : <Moon size={16}/>}
                    <span className="capitalize">{currentDate}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 font-serif">{isLunch ? "Menu Pranzo" : "Menu Cena"}</h2>
            </div>
            <button onClick={() => generateRecipes(null)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-200 flex items-center gap-2 font-semibold transition transform hover:scale-105">
                <Sparkles size={20} /> Idee Random
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-12">
            {currentMeals.map((meal) => (
            <div key={meal.id} onClick={() => handleSelectMeal(meal)} className="group bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition hover:-translate-y-2 hover:shadow-2xl border border-gray-100 flex flex-col h-full">
                <div className="h-48 overflow-hidden relative">
                <img src={meal.image} alt={meal.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm flex items-center gap-1"><Clock size={12} /> {meal.time}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{meal.title}</h3>
                    <p className="text-green-600 font-medium text-sm mb-4">{meal.subtitle}</p>
                    <div className="flex flex-wrap gap-2 mb-4">{meal.tags.map(tag => (<span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{tag}</span>))}</div>
                    <div className="grid grid-cols-3 gap-2 border-t pt-4 text-center mt-auto">
                        <div><div className="text-xs text-gray-400 uppercase font-bold">Prot</div><div className="font-semibold text-gray-700">{meal.nutrition.protein}</div></div>
                        <div><div className="text-xs text-gray-400 uppercase font-bold">Carb</div><div className="font-semibold text-gray-700">{meal.nutrition.carbs}</div></div>
                        <div><div className="text-xs text-gray-400 uppercase font-bold">Cal</div><div className="font-semibold text-gray-700">{meal.nutrition.calories}</div></div>
                    </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
  };

  const renderDetail = () => {
    const getStepText = (step) => {
      if (typeof step === 'string') return step;
      if (typeof step === 'object' && step !== null) {
        return step.instruction || step.step || step.text || step.description || "Segui le istruzioni...";
      }
      return "Segui le istruzioni...";
    };

    return (
    <div className="animate-fade-in max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden my-4 relative">
      <div className="relative h-72 md:h-96">
        <img src={selectedMeal.image} alt={selectedMeal.title} className="w-full h-full object-cover"/>
        <button onClick={() => setView('home')} className="absolute top-6 left-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition text-gray-700 z-10"><ArrowLeft size={24} /></button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedMeal.title}</h2>
            <div className="flex items-center gap-4 text-white/90">
                <span className="flex items-center gap-1"><Clock size={16}/> {selectedMeal.time}</span>
                <span className="flex items-center gap-1"><Users size={16}/> {selectedMeal.servings} Persone</span>
                <span className="flex items-center gap-1"><Flame size={16}/> {selectedMeal.nutrition.calories}</span>
            </div>
        </div>
      </div>
      <div className="bg-green-50 px-8 py-4 border-b border-green-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="text-green-800 font-bold flex items-center gap-2"><Sparkles size={18} /> Azioni Chef AI</div>
            <div className="flex gap-2">
                <button onClick={handleGenerateVariant} className="bg-white hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm border border-green-200 flex items-center gap-2 transition"><RefreshCw size={16} /> Variante Fit/Gourmet</button>
                <button onClick={handleRemixIngredients} className="bg-white hover:bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm border border-purple-200 flex items-center gap-2 transition"><Shuffle size={16} /> Remix Ingredienti</button>
            </div>
      </div>
      <div className="p-8 grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><Utensils className="text-green-600" size={20}/> Preparazione</h3>
                <p className="text-gray-600 mb-6 italic border-l-4 border-green-200 pl-4">"{selectedMeal.description}"</p>
                <ol className="space-y-4 relative border-l border-gray-200 ml-3">
                    {selectedMeal.steps.map((step, idx) => {
                         const stepText = getStepText(step);
                         return (
                           <li key={idx} className="mb-4 ml-6">
                             <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-4 ring-white text-green-700 font-bold text-xs">{idx + 1}</span>
                             <p className="text-gray-700 leading-relaxed">{stepText}</p>
                           </li>
                         );
                    })}
                </ol>
            </div>
        </div>
        <div className="space-y-8">
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-lg font-bold text-green-800 mb-4">Valori Nutrizionali</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm"><div className="text-sm text-gray-500">Proteine</div><div className="text-xl font-bold text-gray-800">{selectedMeal.nutrition.protein}</div></div>
                    <div className="bg-white p-3 rounded-xl shadow-sm"><div className="text-sm text-gray-500">Carboidrati</div><div className="text-xl font-bold text-gray-800">{selectedMeal.nutrition.carbs}</div></div>
                    <div className="bg-white p-3 rounded-xl shadow-sm"><div className="text-sm text-gray-500">Fibre</div><div className="text-xl font-bold text-gray-800">{selectedMeal.nutrition.fiber}</div></div>
                    <div className="bg-white p-3 rounded-xl shadow-sm"><div className="text-sm text-gray-500">Kcal</div><div className="text-xl font-bold text-gray-800">{selectedMeal.nutrition.calories}</div></div>
                </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-gray-600 mb-4">Hai tutto il necessario?</p>
                <button onClick={() => setView('shopping')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-green-500/30 transition flex items-center justify-center gap-3 transform active:scale-95"><ShoppingCart size={20} /> Apri Lista Spesa</button>
            </div>
        </div>
      </div>
    </div>
  );
  };

  const renderShoppingList = () => (
    <div className="animate-fade-in max-w-2xl mx-auto my-6">
       <button onClick={() => setView('detail')} className="mb-6 flex items-center text-gray-500 hover:text-green-600 transition"><ArrowLeft size={20} className="mr-2" /> Torna alla ricetta</button>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-green-600 p-6 text-white flex justify-between items-center"><div><h2 className="text-2xl font-bold">Lista della Spesa</h2><p className="text-green-100 text-sm">per {selectedMeal.title}</p></div><ShoppingCart size={32} className="opacity-50" /></div>
        <div className="p-6">
            <p className="text-gray-500 text-sm mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100"><span className="font-bold">Istruzioni:</span> Spunta gli ingredienti che hai già in casa per calcolare il costo reale.</p>
            <div className="space-y-3">
                {selectedMeal.ingredients.map((ing, index) => {
                    const isChecked = !!checkedIngredients[index];
                    return (
                        <div key={index} onClick={() => toggleIngredient(index)} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition border ${isChecked ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50/50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`transition-colors ${isChecked ? 'text-green-500' : 'text-gray-300'}`}>{isChecked ? <CheckCircle size={24} fill="currentColor" className="text-white" /> : <Circle size={24} />}</div>
                                <div><div className={`font-semibold text-lg ${isChecked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{ing.name}</div><div className="text-xs text-gray-500">Quantità: {ing.qty}</div></div>
                            </div>
                            <div className={`font-mono font-bold ${isChecked ? 'text-gray-300 line-through' : 'text-green-700'}`}>€ {ing.cost.toFixed(2)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-2 text-gray-400 text-sm"><span>Costo Totale Stimato</span><span className="line-through">€ {calculateCosts.total.toFixed(2)}</span></div>
            <div className="flex justify-between items-end border-t border-gray-700 pt-4"><div className="flex items-center gap-2 text-green-400"><Banknote size={24} /><span className="font-bold uppercase tracking-wider text-sm">Da Pagare</span></div><div className="text-4xl font-bold text-white">€ {calculateCosts.remaining.toFixed(2)}</div></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12 relative">
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>
      {isLoading && <LoadingOverlay text={loadingText} />}
      {view !== 'welcome' && (
        <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
                    <AppLogo />
                    <div><h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-none">Chef <span className="text-green-600">Finokio</span></h1><p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Majakol AI</p></div>
                </div>
                {view !== 'mode_selection' && (
                    <div className="flex gap-3"><button onClick={() => setView('mode_selection')} className="hidden md:flex text-sm font-semibold text-gray-500 hover:text-green-600 transition items-center gap-1"><ArrowLeft size={16}/> Indietro</button></div>
                )}
            </div>
        </header>
      )}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        {view === 'welcome' && renderWelcome()}
        {view === 'mode_selection' && renderModeSelection()}
        {view === 'wizard' && renderWizard()}
        {view === 'home' && renderHome()}
        {view === 'detail' && renderDetail()}
        {view === 'shopping' && renderShoppingList()}
      </main>
    </div>
  );
}