import React from 'react'
import { Box, Color, Text } from 'ink'
import Spinner from 'ink-spinner'

const Status = ({ label, emoji, value, displaySpinner, visible }) => {
  if (!visible) return null

  return (
    <Box>
      <Box width={25}>
        <Text bold italic={displaySpinner}>
          <Color green>
            <Box marginRight={1}>{displaySpinner && <Spinner green />}</Box>
            {label}
          </Color>
        </Text>
      </Box>
      {value && (
        <Box>
          <Color blue>{value}</Color>
        </Box>
      )}
    </Box>
  )
}

Status.defaultProps = {
  visible: true,
}

export default Status
