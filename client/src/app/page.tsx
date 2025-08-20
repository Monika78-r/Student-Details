"use client";
import { useEffect, useState } from "react";
import API from "./utils/api";
import styles from "./page.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Page() {
	type User = {
		_id: string;
		name: string;
		rollno: string;
		email: string;
		age: number;
		passout: number;
		skills: string[];
		studyYear: number;
		dept: string;
	};

const [users, setUsers] = useState<User[]>([]);
const [form, setForm] = useState<{
	name: string;
	rollno: string;
	email: string;
	age: string;
	passout: string;
	skills: string[];
	studyYear: string;
	dept: string;
}>({
	name: "",
	rollno: "",
	email: "",
	age: "",
	passout: "",
	skills: [],
	studyYear: "",
	dept: "",
});
const [editingId, setEditingId] = useState<string | null>(null);
const [search, setSearch] = useState("");

	const fetchUsers = async () => {
		try {
			const res = await API.get("/users");
			setUsers(res.data);
		} catch (err) {
			console.error("Error fetching users:", err);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!form.name || !form.rollno || !form.email || !form.age || !form.passout || !form.studyYear || !form.dept) {
			alert('Please fill all fields.');
			return;
		}
		try {
			const payload = {
				name: form.name,
				rollno: form.rollno,
				email: form.email,
				age: Number(form.age),
				passout: Number(form.passout),
				skills: form.skills,
				studyYear: Number(form.studyYear),
				dept: form.dept,
			};
			if (editingId) {
				await API.put(`/users/${editingId}`, payload);
				setEditingId(null);
			} else {
				await API.post("/users", payload);
			}
			setForm({
				name: "",
				rollno: "",
				email: "",
				age: "",
				passout: "",
				skills: [],
				studyYear: "",
				dept: "",
			});
			fetchUsers();
		} catch (err) {
			console.error("Error saving user:", err);
		}
	};

	const deleteUser = async (id: string) => {
		try {
			await API.delete(`/users/${id}`);
			fetchUsers();
		} catch (err) {
			console.error("Error deleting user:", err);
		}
	};

	const editUser = (user: User) => {
		setEditingId(user._id);
		setForm({
			name: user.name || "",
			rollno: user.rollno || "",
			email: user.email || "",
			age: user.age ? user.age.toString() : "",
			passout: user.passout ? user.passout.toString() : "",
			skills: user.skills || [],
			studyYear: user.studyYear ? user.studyYear.toString() : "",
			dept: user.dept || "",
		});
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}> Student Placement Details</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.formRow} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
					<input
						type="text"
						placeholder="Enter Name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
						className={styles.input}
					/>
					<input
						type="text"
						placeholder="Enter Roll No"
						value={form.rollno}
						onChange={(e) => setForm({ ...form, rollno: e.target.value })}
						required
						className={styles.input}
					/>
					<input
						type="email"
						placeholder="Email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
						className={styles.input}
					/>
					<input
						type="text"
						placeholder="Age"
						value={form.age}
						onChange={(e) => setForm({ ...form, age: e.target.value.replace(/[^0-9]/g, '') })}
						required
						minLength={1}
						className={styles.input}
					/>
					<select
						aria-placeholder="Choose Passout Year"
						value={form.passout}
						onChange={(e) => setForm({ ...form, passout: e.target.value })}
						required
						className={styles.input}
					>
						<option value="" disabled hidden>Year of Passing</option>
						{Array.from({ length: 31 }, (_, i) => 2000 + i).map((year) => (
							<option key={year} value={year}>{year}</option>
						))}
					</select>
					<select
						value={form.studyYear}
						onChange={(e) => setForm({ ...form, studyYear: e.target.value })}
						required
						className={styles.input}
					>
						<option value="" disabled>Choose Year of Study</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
					</select>
					<select
						value={form.dept}
						onChange={(e) => setForm({ ...form, dept: e.target.value })}
						required
						className={styles.input}
					>
						<option value="" disabled>Choose Department</option>
						<option value="IT">IT</option>
						<option value="CSE">CSE</option>
						<option value="ECE">ECE</option>
						<option value="AIDS">AIDS</option>
						<option value="MECH">MECH</option>
						<option value="EEE">EEE</option>
					</select>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 0' }}>
						<span style={{ fontSize: '14px', color: '#555', marginBottom: '2px' }}>Skills (choose all that apply):</span>
						{['python', 'cpp', 'java', 'mern', 'dbms', 'frontend', 'backend'].map((skill) => (
							<label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
								<input
									type="checkbox"
									checked={form.skills.includes(skill)}
									onChange={(e) => {
										if (e.target.checked) {
											setForm({ ...form, skills: [...form.skills, skill] });
										} else {
											setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
										}
									}}
								/>
								{skill.charAt(0).toUpperCase() + skill.slice(1)}
							</label>
						))}
					</div>
				</div>
				<div className={styles.actions}>
					<button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
						{editingId ? "Update" : "Create"}
					</button>
					{editingId && (
						<button
							type="button"
							onClick={() => {
								setEditingId(null);
								setForm({
									name: "",
									rollno: "",
									email: "",
									age: "",
									passout: "",
									skills: [],
									studyYear: "",
									dept: "",
								});
							}}
							className={`${styles.btn} ${styles.btnSecondary}`}
						>
							Cancel
						</button>
					)}
				</div>
			</form>

			{/* Search input above the table */}
			<div style={{ margin: "20px 0" }}>
				<input
					type="text"
					placeholder="Search by any field..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={styles.input}
					style={{ maxWidth: 400 }}
				/>
			</div>

			<div className={styles.tableWrap}>
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th>Name</th>
							<th>Roll No</th>
							<th>Email</th>
							<th>Age</th>
							<th>Passout</th>
							<th>Skills</th>
							<th>Year</th>
							<th>Dept</th>
							<th className={styles.actionsCol}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users
							.filter((user) => {
								const searchText = search.toLowerCase();
								return (
									user.name.toLowerCase().includes(searchText) ||
									user.rollno.toLowerCase().includes(searchText) ||
									user.email.toLowerCase().includes(searchText) ||
									user.age.toString().includes(searchText) ||
									user.passout.toString().includes(searchText) ||
									user.skills.join(", ").toLowerCase().includes(searchText) ||
									user.studyYear.toString().includes(searchText) ||
									user.dept.toLowerCase().includes(searchText)
								);
							})
							.map((user) => (
								<tr key={user._id}>
									<td>{user.name}</td>
									<td>{user.rollno}</td>
									<td>{user.email}</td>
									<td>{user.age}</td>
									<td>{user.passout}</td>
									<td>{user.skills && user.skills.length > 0 ? user.skills.join(", ") : "-"}</td>
									<td>{user.studyYear}</td>
									<td>{user.dept}</td>
									<td>
										<div className={styles.rowActions}>
											<button
												onClick={() => editUser(user)}
												className={`${styles.btn} ${styles.btnSmall}`}
											>
												Edit
											</button>
											<button
												onClick={() => deleteUser(user._id)}
												className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						{users.length === 0 && (
							<tr>
								<td colSpan={9} className={styles.empty}>
									No users yet. Add one above.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
