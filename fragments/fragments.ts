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

export const CoreUserInfoMinimalField = gql`
  fragment CoreUserInfoMinimalField on User {
    id
    name
    username
    roles
    school {
      id
      name
    }
    cover {
      id
      path
    }
  }
`;

export const CoreQuizCardMinimalField = gql`
  fragment CoreQuizCardMinimalField on Quiz {
    id
    name
    played_count
    questions {
      metadata {
        content
      }
    }
    difficulty
    user {
      name
    }
    subject {
      name
    }
    classtype {
      level
    }
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

export const CoreQuestionCopyField = gql`
  ${CoreAnswerPlayField}
  fragment CoreQuestionCopyField on QuestionCopy {
    metadata {
      uuid
      type
      content
      correctanswer
      answers {
        ...CoreAnswerPlayField
      }
    }
    documents {
      id
      path
      roles
      metadata {
        original_name
        type
      }
    }
  }
`;

export const CoreQuestionPlayField = gql`
  ${CoreAnswerPlayField}
  fragment CoreQuestionPlayField on Question {
    id
    metadata {
      uuid
      type
      content
      correctanswer
      answers {
        ...CoreAnswerPlayField
      }
    }
    documents {
      id
      path
      roles
      metadata {
        original_name
        type
      }
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

export const CoreAssigmentsubmissionField = gql`
  fragment CoreAssigmentsubmissionField on Assigmentsubmission {
    id
    user {
      name
      cover {
        path
      }
    }
    grade
    graded
    edited_times
    turned_at
    updated_at
    turned

    documents {
      id
      path
      type
      roles
      metadata {
        original_name
        type
      }
    }
  }
`;
