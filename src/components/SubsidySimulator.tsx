"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  MUNICIPALITY_SUBSIDIES,
  SUPPORTED_MUNICIPALITIES,
  type MunicipalitySubsidy,
  type SubsidyHousehold,
} from "@/data/municipalitySubsidies";
import type { CareType } from "@/data/subsidy";

const HOUSEHOLD_LABELS: Record<SubsidyHousehold, string> = {
  general: "一般世帯",
  lowIncome: "住民税非課税世帯",
  welfare: "生活保護受給世帯",
};

const CARE_TYPES: { value: CareType; note: string }[] = [
  { value: "宿泊型", note: "（ショートステイ）" },
  { value: "通所型", note: "（デイサービス）" },
  { value: "訪問型", note: "（アウトリーチ）" },
];

function CareTypeIcon({ type }: { type: CareType }) {
  if (type === "宿泊型") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 24V10M27 24v-9a3 3 0 0 0-3-3H12v8h15M5 20h22M8 12h4" />
        <circle cx="9" cy="15.5" r="2.5" />
      </svg>
    );
  }

  if (type === "通所型") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 26V10l10-5 10 5v16M3 26h26M12 26v-7h8v7M10 13h3M19 13h3" />
        <path d="M16 9v6M13 12h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="m4 15 12-10 12 10M7 13.5V27h18V13.5M13 27v-8h6v8" />
      <path d="M21.5 9.5c0-2 3-2.5 3.8-.6.8-1.9 3.8-1.4 3.8.6 0 2-3.8 4.2-3.8 4.2s-3.8-2.2-3.8-4.2Z" />
    </svg>
  );
}

type SimulationResult = {
  municipality: MunicipalitySubsidy;
  household: SubsidyHousehold;
  careType: CareType;
  uses: number;
  babyAge: number;
  perUseCopay: number;
  totalOwn: number;
};

function CountUpAmount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value <= 0) return;

    const duration = 800;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = 1 - Math.pow(1 - step / steps, 3);
      setDisplay(Math.round(value * progress));
      if (step >= steps) {
        clearInterval(timer);
        setDisplay(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <>¥{display.toLocaleString()}</>;
}

export default function SubsidySimulator() {
  const [municipalityId, setMunicipalityId] = useState(
    SUPPORTED_MUNICIPALITIES[0]?.id ?? "",
  );
  const [household, setHousehold] =
    useState<SubsidyHousehold>("general");
  const [careType, setCareType] = useState<CareType>("宿泊型");
  const [uses, setUses] = useState(3);
  const [babyAge, setBabyAge] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectedMunicipality = MUNICIPALITY_SUBSIDIES[municipalityId];
  const selectedRate = selectedMunicipality?.rates[careType];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const municipality = MUNICIPALITY_SUBSIDIES[municipalityId];
    if (!municipality) {
      setResult(null);
      setError("対応している自治体を選択してください。");
      return;
    }

    const rate = municipality.rates[careType];
    const perUseCopay = household === "general" ? rate.copay : 0;

    setError(null);
    setResult({
      municipality,
      household,
      careType,
      uses,
      babyAge,
      perUseCopay,
      totalOwn: perUseCopay * uses,
    });
  };

  useEffect(() => {
    if (result || error) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result, error]);

  const isFree = result !== null && result.totalOwn === 0;
  const resultRate = result?.municipality.rates[result.careType];

  return (
    <div className="widget subsidy-widget">
      <div className="widget__header">
        <h3 className="widget__title">自己負担額シミュレーター</h3>
        <p className="widget__subtitle">現在は福岡市のみ対応しています</p>
      </div>

      <div className="widget__body">
        <form className="subsidy-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="subsidy-step">
            <legend className="subsidy-step__label">STEP 1 &nbsp;基本情報</legend>

            <div className="subsidy-supported-area" role="note">
              <span className="subsidy-supported-area__label">現在の対応エリア</span>
              <strong>福岡市に住民票がある方</strong>
              <span>その他の自治体は順次対応予定です。</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sub-municipality">
                お住まいの自治体 <span className="required">必須</span>
              </label>
              <select
                className="form-select"
                id="sub-municipality"
                value={municipalityId}
                onChange={(event) => setMunicipalityId(event.target.value)}
                required
              >
                {SUPPORTED_MUNICIPALITIES.map((municipality) => (
                  <option value={municipality.id} key={municipality.id}>
                    {municipality.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <span className="form-label">
                世帯状況 <span className="required">必須</span>
              </span>
              <div className="radio-group">
                {(Object.keys(HOUSEHOLD_LABELS) as SubsidyHousehold[]).map(
                  (value) => (
                    <label className="radio-label" key={value}>
                      <input
                        type="radio"
                        name="household"
                        value={value}
                        checked={household === value}
                        onChange={() => setHousehold(value)}
                      />
                      <span className="radio-box">
                        {HOUSEHOLD_LABELS[value]}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="subsidy-step">
            <legend className="subsidy-step__label">STEP 2 &nbsp;利用内容</legend>

            <div className="form-group">
              <span className="form-label">
                利用形態 <span className="required">必須</span>
              </span>
              <div className="radio-group radio-group--type">
                {CARE_TYPES.map((type) => (
                  <label className="radio-label" key={type.value}>
                    <input
                      type="radio"
                      name="careType"
                      value={type.value}
                      checked={careType === type.value}
                      onChange={() => setCareType(type.value)}
                    />
                    <span className="radio-box">
                      <span className="radio-box__icon">
                        <CareTypeIcon type={type.value} />
                      </span>
                      {type.value}
                      <small>{type.note}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sub-uses">
                  利用予定日数・回数
                </label>
                <div className="range-group">
                  <input
                    className="range-input"
                    id="sub-uses"
                    type="range"
                    min={1}
                    max={selectedMunicipality?.maxCombinedUses ?? 7}
                    step={1}
                    value={uses}
                    onChange={(event) => setUses(Number(event.target.value))}
                  />
                  <output className="range-output">
                    {uses}{selectedRate?.countUnit ?? "日"}
                  </output>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sub-age">
                  赤ちゃんの月齢
                </label>
                <select
                  className="form-select"
                  id="sub-age"
                  value={babyAge}
                  onChange={(event) => setBabyAge(Number(event.target.value))}
                >
                  {Array.from(
                    { length: selectedMunicipality?.eligibleBabyAgeMonths ?? 12 },
                    (_, index) => (
                      <option value={index} key={index}>
                        {index}ヶ月
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {selectedRate?.note && (
              <p className="subsidy-form__note">※{selectedRate.note}</p>
            )}
          </fieldset>

          <div className="form-group form-group--submit">
            <button type="submit" className="btn btn--primary btn--full">
              シミュレーションする
            </button>
          </div>
        </form>

        <div
          className="subsidy-result"
          aria-live="polite"
          hidden={!result && !error}
          ref={resultRef}
        >
          {error && <p className="result-error">⚠️ {error}</p>}

          {result && resultRate && (
            <div
              className="result-card fade-in-up"
              key={JSON.stringify([
                result.municipality.id,
                result.careType,
                result.household,
                result.uses,
                result.babyAge,
              ])}
            >
              <div className="result-card__header">
                <span className="result-tag">
                  {result.municipality.label} / {result.careType} /{" "}
                  {HOUSEHOLD_LABELS[result.household]}
                </span>
                <h4 className="result-card__title">シミュレーション結果</h4>
              </div>

              <div className="result-card__amount">
                <p className="result-amount__label">
                  推定自己負担額（{result.uses}
                  {resultRate.countUnit}分）
                </p>
                <p
                  className={`result-amount__value${isFree ? " result-amount__value--free" : ""}`}
                >
                  {isFree ? (
                    "無料（0円）"
                  ) : (
                    <CountUpAmount value={result.totalOwn} />
                  )}
                </p>
                {isFree && (
                  <p className="result-amount__note">
                    住民税非課税世帯・生活保護受給世帯は自己負担なしです
                  </p>
                )}
              </div>

              <div className="result-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">
                    1{resultRate.countUnit}あたりの自己負担
                  </span>
                  <span className="breakdown-value">
                    ¥{result.perUseCopay.toLocaleString()}
                  </span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">利用予定</span>
                  <span className="breakdown-value">
                    {result.uses}{resultRate.countUnit}
                  </span>
                </div>
                <div className="breakdown-item breakdown-item--total">
                  <span className="breakdown-label">自己負担合計</span>
                  <span className="breakdown-value">
                    ¥{result.totalOwn.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="result-meta">
                <span className="result-meta__item">
                  👶 対象：1歳未満
                </span>
                <span className="result-meta__item">
                  📋 利用上限：合計{result.municipality.maxCombinedUses}日
                </span>
              </div>

              <div className="result-steps">
                <h5 className="result-steps__title">利用までの流れ</h5>
                <ol className="step-list">
                  {result.municipality.applicationSteps.map((step, index) => (
                    <li className="step-item" key={step}>
                      <span className="step-item__num">{index + 1}</span>
                      <span className="step-item__text">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <a
                className="result-link"
                href={result.municipality.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                福岡市の公式案内を確認する →
              </a>
              <p className="result-note">
                {result.municipality.note}
                <br />
                制度情報の確認日：{result.municipality.updatedAt}
              </p>

              <div className="result-card__footer">
                <Link href="/search" className="btn btn--primary">
                  施設を探す
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
