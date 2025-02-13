
# Cursor AI Rules for Clean Architecture - Domain Layer

## 규칙 개요
이 `.cursorrules` 파일은 Clean Architecture의 `Domain` 레이어에서 일관된 코드 스타일과 구조를 유지하기 위해 정의되었습니다.

---

## 1. 프로젝트 구조

### 📁 `src/Domain`
- **`Domain.csproj`**: 프로젝트 구성 파일. 외부 라이브러리 최소화.

### 📁 `Todos`
- `TodoItem.cs`는 `Entity`로서 비즈니스 규칙을 포함해야 한다.
- `Priority.cs`는 `Enum` 또는 `Value Object`로 사용.
- `TodoItemCreatedDomainEvent.cs` 등의 도메인 이벤트는 `IDomainEvent`를 구현해야 한다.

### 📁 `Users`
- `User.cs`는 `Entity`로서 `Setter`를 제한해야 한다.
- `UserRegisteredDomainEvent.cs`는 사용자 등록 이벤트를 처리.

---

## 2. 코드 스타일 가이드

### ✅ 네이밍 규칙
- **엔터티**: `XXX.cs` (예: `TodoItem.cs`)
- **도메인 이벤트**: `XXXDomainEvent.cs` (예: `TodoItemCreatedDomainEvent.cs`)
- **값 객체(Value Object)**: `XXX.cs` (예: `Priority.cs`)
- **에러 클래스**: `XXXErrors.cs` (예: `UserErrors.cs`)

### ✅ 클래스 설계 원칙
- 엔터티는 **불변성을 유지**해야 하며, **Setter를 최소한으로 제한**해야 함.
- 도메인 이벤트를 활용하여 **비즈니스 로직을 엔터티 내부에서 처리**.
- **Value Object는 `Equals()`와 `GetHashCode()`를 재정의**해야 함.

### ✅ 도메인 이벤트 사용 규칙
- `IDomainEvent`를 구현하는 이벤트 클래스를 만들어야 함.
- `Entity` 내에서 상태 변경이 발생하면 `Domain Event`를 발생시켜야 함.

---

## 3. 코드 예제

### ✅ 올바른 예제

```csharp
public class TodoItem : Entity
{
    public string Title { get; private set; }
    public bool IsCompleted { get; private set; }

    public TodoItem(string title)
    {
        Title = title;
        IsCompleted = false;

        // 도메인 이벤트 발생
        AddDomainEvent(new TodoItemCreatedDomainEvent(this));
    }

    public void Complete()
    {
        if (IsCompleted) throw new InvalidOperationException("이미 완료된 항목입니다.");
        IsCompleted = true;
        AddDomainEvent(new TodoItemCompletedDomainEvent(this));
    }
}
```

### ❌ 잘못된 예제

```csharp
public class TodoItem
{
    public string Title { get; set; }
    public bool IsCompleted { get; set; }

    public void MarkAsComplete()
    {
        IsCompleted = true;  // 도메인 이벤트 없이 상태 변경 (잘못된 설계)
    }
}
```

---

## 4. 의존성 관리 규칙
- `Domain` 레이어는 **외부 라이브러리에 직접 의존하면 안 됨** (예: `EF Core`, `ASP.NET Core`).
- **데이터베이스 연산이 없어야 함** (순수 C# 코드로만 구성).
- `IDomainEvent`는 **Application 또는 Infrastructure에서 처리**해야 함.

---

## 5. 테스트 관련 규칙
- `Domain` 레이어의 테스트는 **비즈니스 로직 검증을 위한 단위 테스트**에 집중.
- `Entity` 및 `Value Object`의 동작을 검증해야 함.

---

## 6. 추가 규칙 및 Best Practices
- **Setter 최소화**: 엔터티는 반드시 캡슐화되어야 함.
- **도메인 이벤트 활용**: 상태 변경 시 반드시 도메인 이벤트를 발생.
- **비즈니스 로직 포함**: `Application` 레이어가 아닌 `Domain` 내에서 비즈니스 로직을 수행.

---

## 7. 결론
이 규칙을 준수함으로써 `Domain` 레이어의 순수성과 유지보수성을 극대화할 수 있습니다.  
모든 PR은 `.cursorrules`에 정의된 원칙을 검토한 후 진행해야 합니다.
