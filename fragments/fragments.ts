import { gql } from "@apollo/client";

export const CorePageInfoField = gql`
  fragment CorePageInfoField on PageInfo {
    endCursor
    currentPage
    count
    hasNextPage
    total
  }
`;

export const CORE_USER_INFO_MINIMAL_FIELD = gql`
  fragment CoreUserInfoMinimalField on User {
    id
    name
    username
    roles
    school {
      name
    }
  }
`;

export const ALL_OVERLAY_DATA = gql`
  fragment AllOverlayData on OverlayData {
    theme
    message
    color
    duration
  }
`;

export const CoreAnswerPlayField = gql`
  fragment CoreAnswerPlayField on Answer {
    uuid
    content
    attachment
    attachment_type
  }
`;

export const CoreQuestionPlayField = gql`
  ${CoreAnswerPlayField}
  fragment CoreQuestionPlayField on Question {
    metadata {
      uuid
      type
      content
      correctanswer
      answers {
        ...CoreAnswerPlayField
      }
    }
    pictures {
      id
      path
      roles
    }
    audios {
      id
      path
      roles
    }
    documents {
      id
      path
      roles
    }
    videos {
      id
      path
      roles
    }
  }
`;

export const CoreQuizssesionPlayField = gql`
  ${CoreQuestionPlayField}
  fragment CoreQuizssesionPlayField on Quizsession {
    id
    quiz {
      id
      name
      questions {
        ...CoreQuestionPlayField
      }
      difficulty
    }
  }
`;

export const CoreGenericOutput = gql`
  fragment CoreGenericOutput on GenericOutput {
    status
    message
  }
`;
