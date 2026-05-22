export default async function handler(req, res) {
  try {
    // EIA API - US regular gasoline weekly retail prices
    const response = await fetch(
      'https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=DEMO_KEY&frequency=weekly&data[0]=value&facets[product][]=EMM_EPMR_PTE_NUS_DPG&sort[0][column]=period&sort[0][direction]=desc&length=1'
    );
    const data = await response.json();
    const price = parseFloat(data?.response?.data?.[0]?.value);
    if (price && !isNaN(price)) {
      return res.status(200).json({ price });
    }
    return res.status(200).json({ price: 3.50 });
  } catch {
    return res.status(200).json({ price: 3.50 });
  }
}
