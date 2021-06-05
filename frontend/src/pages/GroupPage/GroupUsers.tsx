import { useContext } from "react";
import { Link } from "react-router-dom";
import { CircleAvatar } from "../../components/CircleAvatar";
import { Container } from "../../components/Container";
import { HeaderWithCount } from "../../components/HeaderWithCount";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { GroupContext } from "../../contexts/GroupContext";

export const GroupUsers = () => {
    const { randomUsers, totalUsers } = useContext(GroupContext);

    return (
        <Container>
            <HeaderWithCount title="Followers" count={totalUsers} />
            {randomUsers === null ? (
                <LoadingPlaceholder />
            ) : (
                <div className="grid grid-cols-3 gap-6 p-4 sm:grid-cols-6 md:grid-cols-3">
                    {randomUsers.map((user) => (
                        <Link to={`/users/${user.userId}`} key={user.userId}>
                            <div className="flex-shrink-0 w-full">
                                <CircleAvatar
                                    fileName={user.avatar?.filename}
                                    identiconSeed={user.userId}
                                />
                            </div>
                            <div className="text-center hover:underline">
                                {user.firstName}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Container>
    );
};
