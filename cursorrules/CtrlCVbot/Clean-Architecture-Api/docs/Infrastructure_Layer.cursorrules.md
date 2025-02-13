
# Cursor AI Rules for Clean Architecture - Infrastructure Layer

## 규칙 개요
이 `.cursorrules` 파일은 Clean Architecture의 `Infrastructure` 레이어에서 일관된 코드 스타일과 구조를 유지하기 위해 정의되었습니다.

---

## 1. 프로젝트 구조

### 📁 `src/Infrastructure`
- **`Infrastructure.csproj`**: 프로젝트 구성 파일. 불필요한 패키지 추가 금지.
- **`DependencyInjection.cs`**: `IServiceCollection`을 사용하여 서비스 등록.

### 📁 `Authentication`
- `PasswordHasher.cs`는 `IPasswordHasher`를 구현해야 한다.
- `TokenProvider.cs`는 `ITokenProvider`를 구현해야 한다.
- `UserContext.cs`는 `IUserContext`를 구현해야 한다.

### 📁 `Authorization`
- `HasPermissionAttribute.cs`는 권한 요구 사항을 정의해야 한다.
- `PermissionAuthorizationHandler.cs`는 `AuthorizationHandler<PermissionRequirement>`를 구현해야 한다.
- `PermissionProvider.cs`는 권한 목록을 정의해야 한다.

### 📁 `Database`
- `ApplicationDbContext.cs`는 `IApplicationDbContext`를 구현해야 한다.
- 모든 엔터티 매핑은 `Fluent API`를 통해 설정해야 한다.
- 데이터베이스 연산은 `ApplicationDbContext`를 통해서만 수행해야 한다.

---

## 2. 코드 스타일 가이드

### ✅ 네이밍 규칙
- **인터페이스**: `I` 접두어 사용 (예: `IApplicationDbContext`)
- **서비스 클래스**: `XXXService` (예: `TokenProvider`)
- **엔터티 매핑 클래스**: `XXXConfiguration` (예: `UserConfiguration`)
- **핸들러 클래스**: `XXXHandler` (예: `PermissionAuthorizationHandler`)

### ✅ 클래스 설계 원칙
- `Infrastructure` 레이어는 `Application` 레이어에 정의된 인터페이스를 구현해야 한다.
- 직접 비즈니스 로직을 포함하지 않으며, 외부 시스템과의 연동을 담당한다.
- `Dependency Injection`을 통해 등록해야 하며, 싱글톤 또는 스코프에 따라 관리.

### ✅ Entity Framework Core 사용 규칙
- 모든 데이터 접근은 `ApplicationDbContext`를 통해 이루어져야 한다.
- `Fluent API`를 사용하여 엔터티 매핑을 설정해야 한다.
- 마이그레이션은 `Infrastructure`에서 수행되어야 한다.

---

## 3. 코드 예제

### ✅ 올바른 예제

```csharp
public class TokenProvider : ITokenProvider
{
    private readonly IConfiguration _configuration;

    public TokenProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Username) };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### ❌ 잘못된 예제

```csharp
public class TokenService
{
    public string GenerateToken(string username)
    {
        // 환경설정 없이 하드코딩된 키 사용 (잘못된 보안 방식)
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("hardcoded-secret-key"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: new List<Claim> { new Claim(ClaimTypes.Name, username) },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

---

## 4. 의존성 관리 규칙
- `Infrastructure`는 `Application` 인터페이스에 대한 구현만 수행해야 한다.
- 외부 서비스 또는 데이터베이스 연결을 직접 노출하면 안 된다.
- `DependencyInjection.cs`에서 모든 서비스 등록을 관리해야 한다.

---

## 5. 테스트 관련 규칙
- `Infrastructure` 레이어는 단위 테스트보다는 **통합 테스트**에 집중.
- 데이터베이스 관련 기능은 **In-Memory Database**를 활용하여 검증.

---

## 6. 추가 규칙 및 Best Practices
- **JWT 기반 인증 유지**: `ITokenProvider`는 `JWT` 또는 `OAuth` 기반 인증을 수행해야 한다.
- **EF Core 마이그레이션 적용**: 마이그레이션이 반드시 `Infrastructure` 내에 있어야 한다.
- **보안 원칙 준수**: 인증/인가 관련 로직은 반드시 환경설정 값을 참조해야 한다.

---

## 7. 결론
이 규칙을 준수함으로써 `Infrastructure` 레이어의 확장성과 유지보수성을 극대화할 수 있습니다.  
모든 PR은 `.cursorrules`에 정의된 원칙을 검토한 후 진행해야 합니다.
