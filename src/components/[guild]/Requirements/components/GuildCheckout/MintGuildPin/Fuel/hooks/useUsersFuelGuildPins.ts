import useUser from "components/[guild]/hooks/useUser"
import useFuel from "hooks/useFuel"
import useSWRImmutable from "swr/immutable"
import { GuildPinMetadata } from "types"
import { GuildPinContractAbi__factory } from "../GuildPinContractAbi_factory"
import { FUEL_GUILD_PIN_CONTRACT_ID } from "./useMintFuelGuildPin"

/**
 * Note: we can only fetch Fuel Guild Pins if the user's Fuel(et) Wallet is
 * connected, since it is required to send a small amount of ETH with each
 * transaction
 *
 * TODO: we'll need to implement this hook once there's a method for fetching a
 * user's guild pins from the contract
 */
const useUsersFuelGuildPins = (disabled = false) => {
  const { addresses } = useUser()

  const fuelAddresses = addresses?.filter((address) => address.walletType === "FUEL")

  const { wallet } = useFuel()

  const shouldFetch = Boolean(!disabled && fuelAddresses?.length && !!wallet)

  const fetchFuelGuildPins = async () => {
    const contract = GuildPinContractAbi__factory.connect(
      FUEL_GUILD_PIN_CONTRACT_ID,
      wallet
    )

    return []
  }

  return useSWRImmutable<
    ({ chainId: number; tokenId: number } & GuildPinMetadata)[]
  >(shouldFetch ? ["fuelGuildPins", fuelAddresses] : null, fetchFuelGuildPins)
}

export default useUsersFuelGuildPins
