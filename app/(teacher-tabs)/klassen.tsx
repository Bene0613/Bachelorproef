import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import SectionHeader from "../../components/SectionHeader";
import { supabase } from "../../lib/supabase";

type Student = {
  id: string;
  name: string;
  avatar_url: string | null;
};

type ClassItem = {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  students: Student[];
};

export default function KlassenScreen() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState("");
  const [openClassId, setOpenClassId] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("id, name, subject")
      .eq("teacher_id", user.id);

    if (classError) {
      console.log("Classes error:", classError);
      return;
    }

    const results: ClassItem[] = [];

    for (const classItem of classData || []) {
        console.log("CLASS ID:", classItem.id);
        const { data: studentLinks, error: studentLinkError } = await supabase
  .from("class_students")
  .select("student_id")
  .eq("class_id", classItem.id);

if (studentLinkError) {
  console.log("Student links error:", studentLinkError);
  continue;
}

const studentIds = studentLinks?.map((row) => row.student_id) || [];
console.log("STUDENT LINKS:", studentLinks);
console.log("STUDENT IDS:", studentIds);

let students: Student[] = [];

if (studentIds.length > 0) {
  const { data: studentProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", studentIds);

  if (profilesError) {
    console.log("Student profiles error:", profilesError);
  } else {
    students =
      studentProfiles?.map((student) => ({
        id: student.id,
        name: student.name,
        avatar_url: student.avatar_url,
      })) || [];
  }
}

      results.push({
        id: classItem.id,
        name: classItem.name,
        subject: classItem.subject,
        studentCount: students.length,
        students,
      });
    }

    setClasses(results);
  };

  const filteredClasses = classes
  .map((classItem) => ({
    ...classItem,
    students: classItem.students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase())
    ),
  }))
  .filter((classItem) => {
    const classMatches = classItem.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const hasMatchingStudents = classItem.students.length > 0;

    return search.trim()
      ? classMatches || hasMatchingStudents
      : true;
  });

  const fifthYear = filteredClasses.filter((item) =>
    item.name.startsWith("5")
  );

  const sixthYear = filteredClasses.filter((item) =>
    item.name.startsWith("6")
  );

  const totalStudents = classes.reduce(
    (total, item) => total + item.studentCount,
    0
  );

  const previewStudents = classes
    .flatMap((item) => item.students)
    .slice(0, 6);

  return (
    <View style={styles.screen}>
      <PageHeader title="Klassen" />

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Zoek leerling"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Text style={styles.searchIcon}>⌕</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          {totalStudents} leerlingen
        </Text>

        <View style={styles.avatarRow}>
          {previewStudents.map((student) => (
            <Image
              key={student.id}
              source={
                student.avatar_url
                  ? { uri: student.avatar_url }
                  : require("../../assets/images/user.jpg")
              }
              style={styles.smallAvatar}
            />
          ))}

          <View style={styles.plusCircle}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterText}>Filters⌃</Text>
        <Text style={styles.icons}>⌫  ✎</Text>
      </View>

      {fifthYear.length > 0 && (
        <ClassSection
          title="5de middelbaar"
          classes={fifthYear}
          router={router}
          openClassId={openClassId}
          setOpenClassId={setOpenClassId}
        />
      )}

      {sixthYear.length > 0 && (
        <ClassSection
          title="6de middelbaar"
          classes={sixthYear}
          router={router}
          openClassId={openClassId}
          setOpenClassId={setOpenClassId}
        />
      )}

      {filteredClasses.length === 0 && (
        <Text style={styles.emptyText}>Geen klassen gevonden.</Text>
      )}
    </View>
  );
}

function ClassSection({
  title,
  classes,
  router,
  openClassId,
  setOpenClassId,
}: {
  title: string;
  classes: ClassItem[];
  router: any;
  openClassId: string | null;
  setOpenClassId: (id: string | null) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.yearTitle}>{title}</Text>

      {classes.map((item) => {
        const isOpen = openClassId === item.id;

        return (
          <View key={item.id}>
            <Pressable
              style={[
                styles.classButton,
                isOpen && styles.classButtonOpen,
              ]}
              onPress={() =>
                setOpenClassId(isOpen ? null : item.id)
              }
            >
              <Text style={styles.classText}>{item.name}</Text>
            </Pressable>

            {isOpen && (
              <View style={styles.studentsBox}>
                {item.students.map((student) => (
                  <Pressable
                    key={student.id}
                    style={styles.studentRow}
                    onPress={() =>
                      router.push({
                        pathname: "/student-modules",
                        params: {
                          studentId: student.id,
                          studentName: student.name,
                          subject: item.subject,
                        },
                      } as any)
                    }
                  >
                    <Image
                      source={
                        student.avatar_url
                          ? { uri: student.avatar_url }
                          : require("../../assets/images/user.jpg")
                      }
                      style={styles.studentAvatar}
                    />

                    <Text style={styles.studentName}>
                      {student.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  searchBox: {
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 26,
    marginTop: 24,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  searchInput: {
    fontSize: 13,
    color: "#333",
  },

  searchIcon: {
    position: "absolute",
    right: 16,
    fontSize: 20,
    color: "#999",
  },

  summaryCard: {
    alignSelf: "center",
    backgroundColor: "#A9CFA4",
    borderRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  summaryText: {
    color: "#fff",
    fontSize: 12,
    marginRight: 12,
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  smallAvatar: {
    width: 22,
    height: 22,
    borderRadius: 6,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },

  plusCircle: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },

  plusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 26,
    marginBottom: 18,
  },

  filterText: {
    fontSize: 13,
    color: "#333",
  },

  icons: {
    fontSize: 12,
    color: "#777",
  },

  section: {
    marginBottom: 28,
  },

  yearTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#555",
    marginLeft: 70,
    marginBottom: 14,
  },

  classButton: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 70,
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  classButtonOpen: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  classText: {
    fontSize: 12,
    color: "#555",
  },

  studentsBox: {
    backgroundColor: "#fff",
    marginHorizontal: 70,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 18,
    marginBottom: 18,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  studentRow: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  studentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 7,
    marginRight: 8,
  },

  studentName: {
    fontSize: 12,
    color: "#555",
    flexShrink: 1,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
    fontSize: 13,
  },
});