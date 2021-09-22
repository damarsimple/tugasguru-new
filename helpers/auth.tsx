import gql from "graphql-tag";
import { CORE_USER_INFO_MINIMAL_FIELD } from "../fragments/fragments";
import { client } from "../pages/_app";
import { useUserStore } from "../store/user";

export const getMyCredentials = async () => {
  const { setState } = useUserStore;
  const { data } = await client.query({
    query: gql`
      ${CORE_USER_INFO_MINIMAL_FIELD}
      query Me {
        me {
          ...CoreUserInfoMinimalField
        }
      }
    `,
  });

  const user = data.me;

  setState({ user });
};
