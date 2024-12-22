const MentionStyle = ({ children, offsetKey }) => (
    <span
        style={{
            color: 'rgb(43, 93, 185)',
        }}
        data-offset-key={offsetKey}
    >
        {children}
    </span>
);

export default MentionStyle