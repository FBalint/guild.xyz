import { Button, Divider, Heading, Text, VStack } from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { GameModeProps } from "pages/guess-the-guild"
import { useState } from "react"
import { GuildBase } from "types"
import AnswerButton from "./AnswerButton"
import ResultAlert from "./ResultAlert"

const getRandomGuild = (guilds: GuildBase[]) =>
  guilds[Math.floor(Math.random() * guilds.length)]

const GuessName = ({ guilds, onNext, onExit }: GameModeProps) => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [solutionGuild] = useState<GuildBase>(getRandomGuild(guilds))
  const [selectedGuildId, setSelectedGuildId] = useState<number | null>()

  const isAnswerCorrect = selectedGuildId === solutionGuild.id

  return (
    <>
      <VStack gap="5">
        <Heading
          as="h2"
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          textAlign="center"
          fontFamily="display"
        >
          Guess the guild by the logo!
        </Heading>
        <VStack>
          <GuildLogo size="100px" />
          <Text>{isAnswerSubmitted ? solutionGuild.name : "???"}</Text>
        </VStack>

        <VStack gap="3" w="100%">
          {guilds.map((guild) => (
            <AnswerButton
              key={guild.id}
              guild={guild}
              solutionGuild={solutionGuild}
              selectedGuildId={selectedGuildId}
              isAnswerSubmitted={isAnswerSubmitted}
              onSelect={() => setSelectedGuildId(guild.id)}
            />
          ))}
        </VStack>

        <Divider />

        {isAnswerSubmitted && <ResultAlert isAnswerCorrect={isAnswerCorrect} />}

        {!isAnswerSubmitted && (
          <Button
            colorScheme="green"
            w="100%"
            isDisabled={typeof selectedGuildId === "undefined"}
            onClick={() => setIsAnswerSubmitted(true)}
          >
            Submit
          </Button>
        )}

        {isAnswerSubmitted && isAnswerCorrect && (
          <Button colorScheme="green" w="100%" onClick={() => onNext()}>
            Continue
          </Button>
        )}

        {isAnswerSubmitted && !isAnswerCorrect && (
          <Button colorScheme="green" w="100%" onClick={() => onExit()}>
            End Game
          </Button>
        )}
      </VStack>
    </>
  )
}

export default GuessName
