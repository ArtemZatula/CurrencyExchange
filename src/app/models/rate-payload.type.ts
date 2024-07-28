export type RatePayload = {
  base_code: string;
  target_code: string;
  conversion_rate: number;
  conversion_result: number;
  result: "success" | "failure";
}
