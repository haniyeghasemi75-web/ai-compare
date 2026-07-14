"use client";
import React, { useState } from "react";
import { aiBrandsDatabase, useCasesList, dynamicCategoryQuestions, globalQuestionsList, comparisonFactorsDatabase, AIScores } from "./data";

type AppMode = "compare" | "recommend";

interface ExtendedAIPlan {
  id: string;
  planName: string;
  isFree: boolean;
  pricingText: string;
  numberlandProductUrl: string;
  numberlandProductName: string;
  duration: string;
  accountType: string;
  features: string[];
  pros: string[];
  weaknesses: string[];
  recommended?: boolean;
}

interface EvaluatedResult {
  brandId: string;
  brandName: string;
  brandNameEn: string;
  description: string;
  score: number;
  plans: ExtendedAIPlan[];
  matchedStrengths: string[];
  matchedWeaknesses: string[];
  topReasons: string[];
  decisionSummary: string;
  scoreDiff: number | null; // تایپ تصحیح شد تا تداخل برطرف شود
}

const compareGoalsList = [
  { id: "coding", label: "برنامه‌نویسی", weights: { coding: 8, execution: 7, reasoning: 5 } },
  { id: "content", label: "تولید محتوا", weights: { content_creation: 8, writing: 7, persian: 6 } },
  { id: "research", label: "تحقیق و مطالعه", weights: { research: 8, files: 7, long_context: 6 } },
  { id: "designer", label: "طراحی و تصویر", weights: { image: 8, tools: 5 } },
  { id: "general", label: "استفاده روزمره", weights: { general: 8, speed: 6, price: 5 } },
  { id: "business", label: "کسب‌وکار", weights: { privacy: 8, tools: 6, writing: 5 } }
];

export default function CustomAICrossComparator() {
  const [appMode, setAppMode] = useState<AppMode | null>(null);
  const [step, setStep] = useState<number>(1); 
  
  const [selectedAIBrands, setSelectedAIBrands] = useState<string[]>([]);
  const [selectedCompareGoal, setSelectedCompareGoal] = useState<string>("");
  
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, { label: string; weights: Partial<AIScores> }>>({});
  
  const [comparisonResults, setComparisonResults] = useState<EvaluatedResult[]>([]);

  const toggleBrandSelection = (id: string) => {
    if (selectedAIBrands.includes(id)) {
      setSelectedAIBrands(selectedAIBrands.filter((item) => item !== id));
    } else {
      if (selectedAIBrands.length < 3) {
        setSelectedAIBrands([...selectedAIBrands, id]);
      }
    }
  };

  const handleAnswerSelect = (qId: string, option: { label: string; weights: Partial<AIScores> }) => {
    setWizardAnswers({ ...wizardAnswers, [qId]: option });
  };

  const resetEngine = () => {
    setAppMode(null);
    setStep(1);
    setSelectedAIBrands([]);
    setSelectedCompareGoal("");
    setSelectedUseCase("");
    setWizardAnswers({});
    setComparisonResults([]);
  };

  const isCategoryQuestionsComplete = (): boolean => {
    const currentQuestions = dynamicCategoryQuestions[selectedUseCase] || [];
    if (currentQuestions.length === 0) return true;
    return currentQuestions.every(q => wizardAnswers[q.id] !== undefined);
  };

  const getSelectedBrandsText = (): string => {
    return aiBrandsDatabase
      .filter(b => selectedAIBrands.includes(b.id))
      .map(b => b.name)
      .join(" و ");
  };

  const runEvaluationEngine = (overrideGoalId?: string) => {
    let userPriorityWeights: Record<string, number> = {};
    
    comparisonFactorsDatabase.forEach(f => {
      userPriorityWeights[f.id] = 1;
    });

    if (appMode === "compare") {
      const targetGoalId = overrideGoalId || selectedCompareGoal;
      const goalObj = compareGoalsList.find(g => g.id === targetGoalId);
      if (goalObj) {
        Object.entries(goalObj.weights).forEach(([fKey, wVal]) => {
          userPriorityWeights[fKey] = (userPriorityWeights[fKey] || 1) + wVal;
        });
      }
    }

    if (appMode === "recommend") {
      Object.values(wizardAnswers).forEach((ansObj) => {
        Object.entries(ansObj.weights).forEach(([fKey, wVal]) => {
          if (wVal !== undefined) {
            userPriorityWeights[fKey] = (userPriorityWeights[fKey] || 1) + wVal;
          }
        });
      });
    }

    const targetsToEvaluate = appMode === "compare" 
      ? aiBrandsDatabase.filter(b => selectedAIBrands.includes(b.id))
      : aiBrandsDatabase;

    let evaluatedList: EvaluatedResult[] = targetsToEvaluate.map((brand) => {
      let totalWeightsSum = 0;
      let weightedScoresSum = 0;

      Object.entries(userPriorityWeights).forEach(([fKey, userWeight]) => {
        const baseScore = brand.scores[fKey as keyof AIScores] || 0;
        weightedScoresSum += baseScore * userWeight;
        totalWeightsSum += userWeight;
      });

      const finalMatchPercentage = totalWeightsSum > 0 ? (weightedScoresSum / totalWeightsSum) : 0;

      const sortedUserPriorities = Object.entries(userPriorityWeights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([fKey]) => fKey);

      let matchedStrengths: string[] = [];
      let matchedWeaknesses: string[] = [];
      let topReasons: string[] = [];
      let decisionSummary = "";

      sortedUserPriorities.forEach((factor, idx) => {
        const aiScore = brand.scores[factor as keyof AIScores] || 0;
        const factorMetadata = comparisonFactorsDatabase.find(f => f.id === factor);
        
        if (factorMetadata) {
          if (aiScore >= 80) {
            topReasons.push(`${brand.name} در شاخص «${factorMetadata.name}» امتیاز ${aiScore} از 100 را دارد که منطبق بر نیاز شماست.`);
            matchedStrengths.push(`پاسخ‌دهی دقیق و بهینه‌سازی شده در شاخص «${factorMetadata.name}» بر اساس دغدغه‌های کاربری شما.`);
            
            if (idx === 0) {
              decisionSummary = `این مدل به دلیل تمرکز ویژه بر شاخص «${factorMetadata.name}» و کسب امتیاز بالای ${aiScore}، بهترین بازدهی فنی را برای اولویت اصلی و جریان کاری شما فراهم می‌کند.`;
            }
          } else if (aiScore < 75) {
            matchedWeaknesses.push(`محدودیت نسبی پلتفرم در پردازش فاکتور «${factorMetadata.name}» نسبت به اولویت‌های وزنی شما.`);
          }
        }
      });

      if (topReasons.length === 0) topReasons = [`تناسب پایدار فاکتورهای عمومی این برند با ساختار تسک‌های شما.`];
      if (matchedStrengths.length === 0) matchedStrengths = brand.strengths.slice(0, 2);
      if (matchedWeaknesses.length === 0) matchedWeaknesses = brand.weaknesses.slice(0, 2);
      if (!decisionSummary) decisionSummary = "این پلتفرم تعادل پایداری در فاکتورهای عمومی و تسک‌های روزمره صنف شما ارائه می‌دهد.";

      const filteredPlans = (brand.plans as ExtendedAIPlan[]).filter(plan => plan.recommended === true);

      return {
        brandId: brand.id,
        brandName: brand.name,
        brandNameEn: brand.nameEn,
        description: brand.description,
        score: Math.min(Math.max(Math.round(finalMatchPercentage), 0), 100),
        plans: filteredPlans,
        matchedStrengths: matchedStrengths.slice(0, 3),
        matchedWeaknesses: matchedWeaknesses.slice(0, 3),
        topReasons: topReasons.slice(0, 3),
        decisionSummary,
        scoreDiff: null 
      };
    });

    evaluatedList = evaluatedList.sort((a, b) => b.score - a.score);

    for (let i = 0; i < evaluatedList.length; i++) {
      if (i < evaluatedList.length - 1) {
        evaluatedList[i].scoreDiff = evaluatedList[i].score - evaluatedList[i + 1].score;
      } else {
        evaluatedList[i].scoreDiff = null;
      }
    }

    setComparisonResults(evaluatedList);
    setStep(appMode === "compare" ? 5 : 4);
  };

  return (
    <main className="bg-gray-50 min-h-screen text-gray-800 p-4 md:p-8 flex flex-col items-center justify-center font-['Yekan_Bakh',sans-serif]" dir="rtl">
      
      {!appMode && (
        <div className="max-w-xl w-full bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
          <span className="text-gray-400 text-xs font-bold tracking-wider font-mono">NUMBERLAND AI</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">انتخاب هوشمند هوش مصنوعی</h1>
          <p className="text-gray-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            ابزارهای هوش مصنوعی را بر اساس نیاز خود ارزیابی و مقایسه کنید.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button 
              onClick={() => { setAppMode("compare"); setStep(1); }}
              className="flex-1 p-5 bg-white border border-gray-200 hover:border-gray-400 rounded-lg text-right transition cursor-pointer"
            >
              <div className="text-sm font-bold text-gray-900">📊 میز مقایسه مستقیم</div>
              <p className="text-gray-400 text-[11px] mt-1 leading-relaxed">انتخاب ۲ یا ۳ مدل و بررسی روبروی هم.</p>
            </button>

            <button 
              onClick={() => { setAppMode("recommend"); setStep(1); }}
              className="flex-1 p-5 bg-white border border-gray-200 hover:border-gray-400 rounded-lg text-right transition cursor-pointer"
            >
              <div className="text-sm font-bold text-gray-900">🎯 پیشنهاد شخصی‌سازی‌شده</div>
              <p className="text-gray-400 text-[11px] mt-1 leading-relaxed">پاسخ به سوالات صنف و تحلیل اولویت‌ها.</p>
            </button>
          </div>
        </div>
      )}

      {appMode && (
        <div className="max-w-xl w-full">
          {((appMode === "compare" && step < 5) || (appMode === "recommend" && step < 4)) && (
            <div className="bg-white px-6 py-4 rounded-t-xl border-t border-x border-gray-200 flex justify-between items-center shadow-sm">
              <h2 className="text-xs font-bold text-gray-500">
                {appMode === "compare" ? "میز مقایسه مستقیم پهلو به پهلو" : `پیشنهاد شخصی صنف: ${useCasesList.find(u=>u.id===selectedUseCase)?.label || "در حال تعیین"}`}
              </h2>
              <button onClick={resetEngine} className="text-[10px] bg-gray-150 text-gray-600 px-2.5 py-1 rounded hover:bg-gray-200 cursor-pointer transition">بازگشت ↩</button>
            </div>
          )}

          {((appMode === "compare" && step < 5) || (appMode === "recommend" && step < 4)) && (
            <div className="bg-white p-6 md:p-8 rounded-b-xl border-b border-x border-gray-200 shadow-sm mb-6">
              
              {appMode === "compare" && step === 1 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">کدام مدل‌ها را مقایسه کنیم؟ (۲ یا ۳ مورد)</h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {aiBrandsDatabase.map((brand) => {
                      const isSelected = selectedAIBrands.includes(brand.id);
                      return (
                        <button
                          key={brand.id}
                          onClick={() => toggleBrandSelection(brand.id)}
                          className={`p-3.5 text-right rounded-lg border text-xs transition cursor-pointer flex justify-between items-center ${
                            isSelected ? "bg-gray-100 border-gray-400 text-gray-900 font-bold" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div>
                            <span className="text-gray-900 font-bold">{brand.name}</span>{" "}
                            <span className="text-gray-400 font-mono text-[10px]">({brand.nameEn})</span>
                          </div>
                          <span className="text-[11px] text-gray-400">{isSelected ? "✓ انتخاب شده" : "+ افزودن"}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-left">
                    <button
                      onClick={() => setStep(2)}
                      disabled={selectedAIBrands.length < 2}
                      className="bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2 px-5 rounded-lg text-xs transition cursor-pointer"
                    >
                      ادامه و تعیین هدف ←
                    </button>
                  </div>
                </div>
              )}

              {appMode === "compare" && step === 2 && (
                <div>
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600">شما <span className="text-gray-900 font-bold">{getSelectedBrandsText()}</span> را انتخاب کرده‌اید.</p>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mb-4">هدف اصلی شما از مقایسه چیست幕؟</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {compareGoalsList.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => { setSelectedCompareGoal(goal.id); runEvaluationEngine(goal.id); }}
                        className="p-3 text-right text-xs rounded-lg border bg-white border-gray-200 text-gray-700 hover:border-gray-400 transition cursor-pointer"
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">← بازگشت به انتخاب ابزارها</button>
                  </div>
                </div>
              )}

              {appMode === "recommend" && step === 1 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">حوزه فعالیت یا تخصص خود را مشخص کنید:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pl-1">
                    {useCasesList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setSelectedUseCase(item.id); setStep(2); }}
                        className="p-3 text-right text-xs rounded-lg border bg-white border-gray-200 text-gray-700 hover:border-gray-400 transition cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {appMode === "recommend" && step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">تنظیم اولویت‌ها بر اساس نیازمندی‌های شما</h3>
                  
                  {(dynamicCategoryQuestions[selectedUseCase] || []).map((q) => (
                    <div key={q.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-xs font-bold text-gray-700 mb-2.5">{q.question}</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {q.options.map((opt) => {
                          const isSelected = wizardAnswers[q.id]?.label === opt.label;
                          return (
                            <button
                              key={opt.label}
                              onClick={() => handleAnswerSelect(q.id, opt)}
                              className={`p-2 text-right text-xs rounded border transition cursor-pointer ${
                                isSelected ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                    <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">← بازگشت</button>
                    <button 
                      onClick={() => setStep(3)} 
                      disabled={!isCategoryQuestionsComplete()}
                      className="bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition"
                    >
                      مرحله بعد ←
                    </button>
                  </div>
                </div>
              )}

              {appMode === "recommend" && step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">ترجیحات عمومی کاربری</h3>
                  
                  {globalQuestionsList.map((q) => (
                    <div key={q.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-xs font-bold text-gray-700 mb-2.5">{q.question}</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {q.options.map((opt) => {
                          const isSelected = wizardAnswers[q.id]?.label === opt.label;
                          return (
                            <button
                              key={opt.label}
                              onClick={() => handleAnswerSelect(q.id, opt)}
                              className={`p-2 text-right text-xs rounded border transition cursor-pointer ${
                                isSelected ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between">
                    <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">← بازگشت</button>
                    <button 
                      onClick={() => runEvaluationEngine()} 
                      className="bg-gray-900 hover:bg-black text-white font-medium px-5 py-2 rounded-lg text-xs transition cursor-pointer"
                    >
                      🎯 مشاهده نتیجه نهایی
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {((appMode === "compare" && step === 5) || (appMode === "recommend" && step === 4)) && comparisonResults.length > 0 && (
        <div className="max-w-xl w-full bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm my-6">
          
          <div className="text-center border-b border-gray-150 pb-5 mb-6">
            <h2 className="text-xl font-bold text-gray-900">📊 کارنامه نهایی سنجش انطباق</h2>
            <p className="text-gray-400 text-xs mt-1">گزینه‌های ارزیابی شده بر اساس بیشترین سازگاری با نیاز شما رتبه‌بندی شده‌اند:</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {comparisonResults.map((item, idx) => {
              const isFirstPlace = idx === 0;
              return (
                <div key={item.brandId} className="p-5 rounded-xl border border-gray-200 bg-white relative">
                  
                  {isFirstPlace && (
                    <div className="absolute top-0 left-0 bg-gray-900 text-white font-medium text-[9px] px-2.5 py-1 rounded-br-lg shadow-sm">
                      🏆 بهترین تطابق
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3 mt-1">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        <span className="text-gray-300 text-xs font-mono pl-1">#{idx + 1}</span>{" "}
                        {item.brandName}{" "}
                        <span className="text-xs font-normal font-mono text-gray-400">({item.brandNameEn})</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="text-left bg-gray-50 p-2 rounded border border-gray-150 min-w-[100px]">
                      <div className="text-lg font-bold text-gray-900 font-mono text-center">{item.score}%</div>
                      
                      <div className="text-[9px] text-gray-400 text-center mt-1 border-t border-gray-200/60 pt-1">
                        {item.scoreDiff !== null ? `${item.scoreDiff}٪ اختلاف با بعدی` : "پایان لیست"}
                      </div>
                    </div>
                  </div>

                  <div className="my-2.5 p-3 bg-gray-50 rounded-lg border border-gray-150 text-[11px] text-gray-600 leading-relaxed">
                    <strong>بررسی:</strong> {item.decisionSummary}
                  </div>

                  <div className="my-2.5 p-3 bg-gray-50/50 rounded-lg border border-gray-150 text-[11px]">
                    <span className="font-bold text-gray-700 block mb-1">📌 دلایل اصلی تطابق:</span>
                    <ul className="text-gray-600 space-y-1 list-disc list-inside">
                      {item.topReasons.map((reason, i) => <li key={i}>{reason}</li>)}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-[11px]">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-gray-600">
                      <span className="font-bold text-gray-800 block mb-1">🌟 مزایای مرتبط:</span>
                      <ul className="space-y-0.5 list-disc list-inside">
                        {item.matchedStrengths.map((point, i) => <li key={i}>{point}</li>)}
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-gray-500">
                      <span className="font-bold text-gray-700 block mb-1">⚠️ محدودیت‌ها:</span>
                      <ul className="space-y-0.5 list-disc list-inside">
                        {item.matchedWeaknesses.map((point, i) => <li key={i}>{point}</li>)}
                      </ul>
                    </div>
                  </div>

                  {item.plans.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-150">
                      <span className="text-[11px] font-bold text-gray-700 block mb-2">📦 پلن‌های پیشنهادی خرید:</span>
                      <div className="grid grid-cols-1 gap-1">
                        {item.plans.map((plan) => (
                          <div key={plan.id} className="bg-white p-2 rounded border border-gray-200 flex items-center justify-between text-[11px]">
                            <span className="text-gray-800 font-medium">{plan.planName}</span>
                            
                            {plan.numberlandProductUrl && (
                              <a 
                                href={plan.numberlandProductUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-900 hover:bg-black text-white py-1 px-3 rounded text-[10px] transition shadow-sm"
                              >
                                مشاهده گزینه‌های خرید در نامبرلند
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          <button
            onClick={resetEngine}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-750 font-medium py-2.5 rounded-lg text-xs transition cursor-pointer text-center border border-gray-200 shadow-sm"
          >
            🔄 پاک کردن فیلترها و شروع مجدد
          </button>

        </div>
      )}

    </main>
  );
}
