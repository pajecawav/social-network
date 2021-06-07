import clsx from "clsx";
import { Container } from "../../components/Container";
import { HeaderWithCount } from "../../components/HeaderWithCount";
import { UserCard } from "../../components/UserCard";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { User } from "../../types";

type GroupContactsProps = {
    admin: User;
};

export const GroupContacts = ({ admin }: GroupContactsProps) => {
    const isSmallScreen = useIsSmallScreen();

    return (
        <Container>
            <HeaderWithCount title="Contacts" />

            <div className="p-4">
                <UserCard
                    user={admin}
                    avatarClassName={clsx(!isSmallScreen && "w-12")}
                />
            </div>
        </Container>
    );
};
