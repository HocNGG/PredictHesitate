export const PROPERTY_TYPES = [
  { id: 0, label: "căn hộ chung cư" },
  { id: 2, label: "nhà riêng" },
  { id: 3, label: "nhà biệt thự, liền kề" },
  { id: 4, label: "nhà mặt phố" },
  { id: 7, label: "bán đất" },
] as const

export const DISTRICTS = [
  { id: 0, label: "bình chánh" },
  { id: 1, label: "bình tân" },
  { id: 2, label: "bình thạnh" },
  { id: 3, label: "cần giờ" },
  { id: 4, label: "củ chi" },
  { id: 5, label: "gò vấp" },
  { id: 6, label: "hóc môn" },
  { id: 7, label: "nhà bè" },
  { id: 8, label: "phú nhuận" },
  { id: 9, label: "quận 1" },
  { id: 10, label: "quận 10" },
  { id: 11, label: "quận 11" },
  { id: 12, label: "quận 12" },
  { id: 13, label: "quận 2" },
  { id: 14, label: "quận 3" },
  { id: 15, label: "quận 4" },
  { id: 16, label: "quận 5" },
  { id: 17, label: "quận 6" },
  { id: 18, label: "quận 7" },
  { id: 19, label: "quận 8" },
  { id: 20, label: "quận 9" },
  { id: 21, label: "thủ đức" },
  { id: 22, label: "tân bình" },
  { id: 23, label: "tân phú" },
] as const

export function getPropertyTypeLabel(id: number): string {
  return PROPERTY_TYPES.find((p) => p.id === id)?.label ?? `mã ${id}`
}

export function getDistrictLabel(id: number): string {
  return DISTRICTS.find((d) => d.id === id)?.label ?? `mã ${id}`
}
