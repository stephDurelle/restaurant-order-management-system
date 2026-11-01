// ma composante statcard
//type me permet de donner une identité visuelle, si par exple type vaut pending le navigateur recoit div class="stat-card pending"
function StatCard({title, value,type}){
return(
    <div className={`stat-card ${type}`}>
        <h3>{title}</h3>
        <h3>{value}</h3>

    </div>
)
}export default StatCard