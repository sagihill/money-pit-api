import { CryptoTypes } from "../../../types";
import { ServicesProvider } from "../services-provider";
import { CryptoService } from "../../crypto";

export default async function Crypto(
  options: any,
  SP: ServicesProvider
): Promise<CryptoTypes.ICryptoService> {
  const config = await SP.Config();
  const cryptoService = new CryptoService(
    await config.get("CREDIT_ACCOUNTS_SECRET")
  );

  return cryptoService;
}
