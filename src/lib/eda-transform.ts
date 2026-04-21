export interface PriceBinLike {
  label: string
  count: number
}

const PRICE_BIN_ORDER = ["0-30", "30-50", "50-70", "70-90", "90-110", "110-130", "130+"]

/**
 * Sorts price bins according to a standard order.
 */
export function sortPriceBins<T extends PriceBinLike>(bins: T[]): T[] {
  const orderMap = new Map(PRICE_BIN_ORDER.map((label, index) => [label, index]));
  
  return [...bins].sort((a, b) => {
    const indexA = orderMap.has(a.label) ? orderMap.get(a.label)! : 999;
    const indexB = orderMap.has(b.label) ? orderMap.get(b.label)! : 999;
    return indexA - indexB;
  });
}

export interface DistrictPropertyTypeLike {
  district: string
  property_type: string
  median_price: number
  sample_count: number
}

/**
 * Transforms flat district-property type data into a grouped format suitable
 * for Recharts grouped bar charts or heatmaps.
 */
export function groupDistrictPropertyMedianPrice(data: DistrictPropertyTypeLike[]) {
  const grouped: Record<string, Record<string, number>> = {}

  for (const item of data) {
    if (!grouped[item.district]) grouped[item.district] = {}
    grouped[item.district][item.property_type] = item.median_price
  }

  return Object.entries(grouped).map(([district, types]) => ({ district, ...types }))
}

export interface ScatterPoint {
  x: number
  y: number
  area: number // diện tích
  pricePerM2: number // giá/m2
}

/**
 * Parses scatter plot CSV data without hardcoding column indices.
 * Relies on matching column headers to identity the fields.
 */
export function parseScatterCsv(csvText: string): ScatterPoint[] {
  if (!csvText || !csvText.trim()) return [];
  
  // Handle different newline formats (\r\n or \n)
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  
  // Parse headers and normalize format (lowercase, trim spaces)
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Find dynamic indices based on column names
  const idxX = headers.findIndex(h => h.includes('tọa độ x') || h === 'x');
  const idxY = headers.findIndex(h => h.includes('tọa độ y') || h === 'y');
  const idxArea = headers.findIndex(h => h.includes('diện tích') || h === 'area');
  const idxPrice = headers.findIndex(h => h.includes('giá/m2') || h.includes('price/m2') || h === 'price');
  
  const points: ScatterPoint[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting (does not handle commas inside quotes)
    const row = lines[i].split(',').map(val => val.trim());
    
    // Ensure the row has the correct number of columns
    if (row.length === headers.length) {
      const x = idxX !== -1 ? parseFloat(row[idxX]) : 0
      const y = idxY !== -1 ? parseFloat(row[idxY]) : 0
      const area = idxArea !== -1 ? parseFloat(row[idxArea]) : 0
      const pricePerM2 = idxPrice !== -1 ? parseFloat(row[idxPrice]) : 0

      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(area) || !Number.isFinite(pricePerM2)) continue

      points.push({ x, y, area, pricePerM2 });
    }
  }
  
  return points;
}
