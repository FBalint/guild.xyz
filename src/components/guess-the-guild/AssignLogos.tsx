import { Alert, AlertIcon, Divider, Heading, VStack } from "@chakra-ui/react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import React, { useState } from "react"
import { GuildBase } from "types"
import Draggable from "./assign-logos/Draggable"
import GuildCardWithDropzone from "./assign-logos/GuildCardWithDropzone"
import SourceDropzone from "./assign-logos/SourceDropzone"
import useDragAndDrop, { START_ZONE_ID } from "./assign-logos/useDragAndDrop"

const AssignLogos = ({ guilds }: { guilds: GuildBase[] }) => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const avatarSize = 90

  const { startZone, dropzones, movingGuild, dragStart, dragEnd } =
    useDragAndDrop(guilds)

  const handleDragStart = (event: DragStartEvent) => {
    if (isAnswerSubmitted) return
    dragStart(event)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (isAnswerSubmitted) return
    dragEnd(event)
  }

  const renderDraggableAvatar = (guild: GuildBase) => {
    if (!guild) return
    return (
      <React.Fragment key={guild.id}>
        {guild.id != movingGuild?.id && (
          <Draggable id={`${guild.id}`}>
            <GuildLogo w={avatarSize} h={avatarSize} imageUrl={guild.imageUrl} />
          </Draggable>
        )}
      </React.Fragment>
    )
  }

  const isAnswerCorrect = Object.entries(dropzones).every(
    ([zoneId, guild]) => `${guild?.id}` === zoneId
  )
  const isLogoCorrectForGuild = (guild: GuildBase) =>
    dropzones[guild.id]?.id === guild?.id

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

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {!isAnswerSubmitted && (
            <>
              <SourceDropzone id={START_ZONE_ID} size={avatarSize}>
                {startZone.map((guild) => renderDraggableAvatar(guild))}
              </SourceDropzone>
            </>
          )}

          <DragOverlay>
            {movingGuild && !isAnswerSubmitted ? (
              <GuildLogo w={avatarSize} h={avatarSize} />
            ) : null}
          </DragOverlay>

          {guilds.map((guild) => (
            <GuildCardWithDropzone
              key={guild.id}
              guild={guild}
              avatarSize={avatarSize}
              isAnswerSubmitted={isAnswerSubmitted}
              isLogoCorrect={isLogoCorrectForGuild(guild)}
            >
              {renderDraggableAvatar(dropzones[`${guild.id}`])}
            </GuildCardWithDropzone>
          ))}
        </DndContext>

        <Divider />

        {isAnswerSubmitted && (
          <Alert
            status={isAnswerCorrect ? "success" : "warning"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <AlertIcon />{" "}
            {isAnswerCorrect ? "Your answer is correct!" : "Wrong answer!"}
          </Alert>
        )}

        {isAnswerSubmitted && (
          <Button colorScheme="green" w="100%">
            Continue
          </Button>
        )}
        {!isAnswerSubmitted && (
          <Button
            colorScheme="green"
            w="100%"
            onClick={() => setIsAnswerSubmitted(true)}
          >
            Submit
          </Button>
        )}
      </VStack>
    </>
  )
}

export default AssignLogos
