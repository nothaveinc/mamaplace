import Form from "next/form";
import { AREAS, CARE_TYPE_OPTIONS, HOTEL_RESORT_AREA } from "@/data/facilities";
import type { CareType } from "@/data/subsidy";

const CARE_TYPE_LABEL: Record<CareType, string> = {
  宿泊型: "宿泊",
  通所型: "日帰り",
  訪問型: "訪問",
};

export default function HomeFacilitySearch() {
  return (
    <section id="facility-search" className="home-facility-search" aria-labelledby="home-facility-search-title">
      <div className="container">
        <div className="home-facility-search__card">
          <div className="home-facility-search__heading">
            <p className="home-facility-search__eyebrow">あなたに合う施設を探す</p>
            <h2 id="home-facility-search-title">条件から産後ケア施設を検索</h2>
          </div>

          <Form action="/search" className="home-facility-search__form">
            <div className="home-facility-search__field">
              <label htmlFor="home-search-residence">居住地</label>
              <select id="home-search-residence" name="residence" defaultValue="">
                <option value="">指定なし</option>
                <option value="福岡市">福岡市</option>
                <option value="福岡市外">福岡市外</option>
              </select>
            </div>

            <div className="home-facility-search__field">
              <label htmlFor="home-search-area">施設の場所</label>
              <select id="home-search-area" name="area" defaultValue="">
                <option value="">指定なし</option>
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    福岡県 {area}
                  </option>
                ))}
                <option value={HOTEL_RESORT_AREA}>{HOTEL_RESORT_AREA}</option>
              </select>
            </div>

            <div className="home-facility-search__field">
              <label htmlFor="home-search-care-type">ケア種別</label>
              <select id="home-search-care-type" name="type" defaultValue="">
                <option value="">指定なし</option>
                {CARE_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {CARE_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn--primary home-facility-search__submit">
              この条件で検索
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
}
