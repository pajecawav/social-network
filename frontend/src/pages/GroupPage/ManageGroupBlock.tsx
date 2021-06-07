import { CogIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../components/Container";
import { GroupContext } from "../../contexts/GroupContext";

export const ManageGroupBlock = () => {
    const { group } = useContext(GroupContext);

    return (
        <Container className="flex flex-col py-2 ">
            <Link
                to={`/groups/${group?.groupId}/manage`}
                className="w-full px-2 py-2 transition-colors duration-200 text-primary-300 hover:bg-primary-600 "
            >
                <CogIcon className="inline-block w-6 mr-2 text-secondary-700" />
                <span>Manage</span>
            </Link>
        </Container>
    );
};
