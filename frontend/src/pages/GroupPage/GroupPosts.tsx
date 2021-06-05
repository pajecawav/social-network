import { useContext } from "react";
import { Container } from "../../components/Container";
import { HeaderWithCount } from "../../components/HeaderWithCount";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import { GroupContext } from "../../contexts/GroupContext";

export const GroupPosts = () => {
    const { posts } = useContext(GroupContext);

    return (
        <Container>
            <HeaderWithCount title="Group posts" />
            {posts === null ? (
                <LoadingPlaceholder />
            ) : (
                posts.length === 0 && (
                    <div className="flex items-center justify-center h-20 m-auto my-6 text-primary-400">
                        No posts were found
                    </div>
                )
            )}
        </Container>
    );
};
