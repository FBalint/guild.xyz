import {
  ButtonGroup,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Img,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import Star from "static/icons/star.svg"
import { PlatformType } from "types"
import AddNewPointsType from "./components/AddNewPointsType"
import ExistingPointsTypeSelect from "./components/ExistingPointsTypeSelect"

type Props = {
  onSuccess: () => void
}

type AddPointsFormType = {
  guildPlatformId: number
  amount: string
  name: string
  imageUrl: string
}

const AddPointsPanel = ({ onSuccess }: Props) => {
  const { id, guildPlatforms } = useGuild()

  const existingPointsRewards = guildPlatforms.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const methods = useForm<AddPointsFormType>({
    mode: "all",
    defaultValues: {
      guildPlatformId: existingPointsRewards?.[0]?.id,
    },
  })
  const {
    control,
    setValue,
    formState: { errors },
  } = methods

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const amount = useWatch({ control, name: "amount" })
  const selectedExistingId = useWatch({
    control,
    name: "guildPlatformId",
  })
  const localName = useWatch({ control, name: "name" })
  const localImageUrl = useWatch({ control, name: "imageUrl" })

  const { name: selectedName, imageUrl: selectedImageUrl } =
    existingPointsRewards?.find((gp) => gp.id === selectedExistingId)
      ?.platformGuildData ?? {}

  const name = selectedName ?? localName
  const imageUrl = selectedExistingId ? selectedImageUrl : localImageUrl // not just ?? so it doesn't stay localImageUrl if we upload an image then switch to an existing type without image

  const onSubmit = (data) => {
    append({
      ...(selectedExistingId
        ? {
            guildPlatformId: selectedExistingId,
            // have to send these in this case too so the validator doesn't throw an error
            guildPlatform: {
              platformName: "POINTS",
              platformGuildId: "",
              platformGuildData: {},
            },
          }
        : {
            guildPlatform: {
              platformName: "POINTS",
              platformGuildId: `points-${id}-${data.name.toLowerCase() || "points"}`,
              platformGuildData: {
                name: data.name,
                imageUrl: data.imageUrl,
              },
            },
          }),
      isNew: true,
      platformRoleData: {
        score: parseInt(data.amount),
      },
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        Gamify your guild with a score system, so users can collect points / XP /
        your custom branded score, and compete on a leaderboard. You’ll also be able
        to set points based requirements for satisfying higher level roles!
      </Text>
      {!!existingPointsRewards.length && (
        <ExistingPointsTypeSelect
          existingPointsRewards={existingPointsRewards}
          selectedExistingId={selectedExistingId}
        />
      )}
      <Collapse
        in={!existingPointsRewards.length || selectedExistingId === null}
        style={{ flexShrink: 0 }}
      >
        <AddNewPointsType
          name={name}
          imageUrl={imageUrl}
          isOptional={!existingPointsRewards.length}
        />
        <Divider mt={8} mb={7} />
      </Collapse>
      <FormControl isInvalid={!!errors?.amount} pt={{ md: 0.5 }}>
        <FormLabel>{`How many ${name || "points"} to get?`}</FormLabel>
        <Stack direction={{ base: "column", md: "row" }}>
          <NumberInput
            value={amount}
            {...(methods.register("amount", {
              required: "This field is required",
            }) as any)}
            onChange={(newValue) => {
              setValue("amount", newValue)
            }}
          >
            <NumberInputField placeholder="0" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <ButtonGroup flex="1" size={{ base: "sm", md: "md" }}>
            <ShortcutButton amount={5} imageUrl={imageUrl} />
            <ShortcutButton amount={10} imageUrl={imageUrl} />
            <ShortcutButton amount={50} imageUrl={imageUrl} />
            <ShortcutButton amount={100} imageUrl={imageUrl} />
          </ButtonGroup>
        </Stack>
        <FormErrorMessage>{errors?.amount?.message as string}</FormErrorMessage>
      </FormControl>
      <Flex justifyContent={"flex-end"} mt="auto" pt="10">
        <Button colorScheme="green" onClick={methods.handleSubmit(onSubmit)}>
          Continue
        </Button>
      </Flex>
    </FormProvider>
  )
}

const ShortcutButton = ({ amount, imageUrl }) => {
  const { setValue } = useFormContext()

  return (
    <Button
      w="full"
      leftIcon={
        imageUrl ? (
          <Img src={imageUrl} boxSize="4" borderRadius={"full"} />
        ) : (
          <Star />
        )
      }
      h={{ md: "10" }}
      onClick={() => {
        setValue("amount", amount, { shouldValidate: true })
      }}
    >
      {amount}
    </Button>
  )
}

export default AddPointsPanel
