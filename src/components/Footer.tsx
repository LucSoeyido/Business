

export default function Footer() {
    return (
        <footer className="footer" style={{ textAlign: 'center', backgroundColor:'#1e1e2d'}}>
            <p>
                <span>Copyright &copy; {new Date().getFullYear()}</span>
            </p>
            <p>

                <span >Powered by: Lucky Dev</span>
            </p>

        </footer>
    )
}